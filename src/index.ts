import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema";
import NestedError from "nested-error-stacks";
import { JsDoc, JsDocTag, Property, Type, TypeKind } from "tst-reflect";
import ts from "typescript";
import { updateWithJsDocs } from "./updateWithJsDocs";

export interface Options {
  extraTags?: string[];
  schemaId?: string;
}

export const DEFAULT_OPTIONS: Options = {};

export function createJsonSchema(type: Type, options?: Options): JSONSchema7 {
  options = { ...DEFAULT_OPTIONS, ...options };

  const definitions: Record<string, JSONSchema7Definition> = {};
  createDefinitionForType(type, definitions, {}, options);

  const result: JSONSchema7 = {
    $ref: `#/definitions/${encodeURIComponent(type.name)}`,
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions,
  };
  if (options.schemaId) {
    result.$id = options.schemaId;
  }
  return result;
}

function createDefinitionForType(
  type: Type,
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): JSONSchema7 {
  type = resolveType(type, genericTypes);

  if (type.isArray()) {
    return createDefinitionForArray(type, definitions, genericTypes, options);
  }

  if (type.fullName === "any" || type.fullName === "unknown") {
    return {};
  }

  if (
    type.fullName === "String" ||
    type.fullName === "string" ||
    type.fullName === "Number" ||
    type.fullName === "number" ||
    type.fullName === "Boolean" ||
    type.fullName === "boolean" ||
    type.fullName === "undefined" ||
    type.kind === TypeKind.LiteralType
  ) {
    const def: JSONSchema7 = {
      type: getTypeNameFromType(type),
    };
    if (type.literalValue !== undefined) {
      def.const = type.literalValue;
    }
    return def;
  }

  // optional type (a?: string)
  if (type.kind == TypeKind.Container && type.isUnion()) {
    const types = type.types.filter((t) => t.fullName !== "undefined");

    const onlyType = types[0];
    if (types.length === 1 && onlyType) {
      return createDefinitionForType(
        onlyType,
        definitions,
        genericTypes,
        options
      );
    }
    throw new Error("unhandled type");
  }

  const ref: JSONSchema7 = createRef(type);
  const typeName = createTypeName(type);
  if (definitions[typeName]) {
    return ref;
  }

  if (type.kind === TypeKind.Enum) {
    definitions[typeName] = createDefinitionForEnum(type);
    return ref;
  }

  const properties: Record<string, JSONSchema7Definition> = {};
  const required: string[] = [];
  const def: JSONSchema7 = {
    type: "object",
    additionalProperties: false,
    properties,
    required,
  };

  updateWithJsDocs(type, def, options);

  for (let t: Type | undefined = type; t; t = t.baseType) {
    updateProperties(t, def, definitions, genericTypes, options);
  }

  if (def.required?.length === 0) {
    delete def.required;
  } else if (def.required) {
    def.required = [...new Set(def.required)].sort();
  }
  if (def.properties && Object.keys(def.properties).length === 0) {
    delete def.properties;
  }
  definitions[typeName] = def;
  return ref;
}

function createRef(type: Type): JSONSchema7 {
  return {
    $ref: `#/definitions/${encodeURIComponent(createTypeName(type))}`,
  };
}

function createDefinitionForArray(
  type: Type,
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): JSONSchema7 {
  const typeArg = type.getTypeArguments()[0];
  return {
    type: "array",
    items: typeArg
      ? createDefinitionForType(typeArg, definitions, genericTypes, options)
      : { type: "object" },
  };
}

function createDefinitionForEnum(type: Type): JSONSchema7Definition {
  let enumValueType: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
  const enumValues: JSONSchema7Type[] = type.types.map((enumValue) => {
    const vt = getJsonSchemaTypeNameFromLiteralValue(enumValue.literalValue);
    if (enumValueType === undefined) {
      enumValueType = vt;
    } else if (enumValueType !== vt) {
      if (Array.isArray(enumValueType)) {
        if (!enumValueType.includes(vt)) {
          enumValueType.push(vt);
        }
      } else {
        enumValueType = [enumValueType, vt];
      }
    }
    return enumValue.literalValue;
  });
  return {
    enum: enumValues,
    type: enumValueType,
  };
}

function updateProperties(
  parentType: Type,
  def: JSONSchema7,
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): void {
  const isPartial = parentType.fullName === "Partial";
  if (isPartial) {
    const genericArguments = parentType.getTypeArguments();
    const ga = genericArguments?.[0];
    if (genericArguments?.length !== 1 || ga === undefined) {
      throw new Error("invalid Partial, expected 1 generic argument");
    }
    parentType = ga;
  }

  genericTypes = { ...genericTypes, ...getGenericTypeMap(parentType) };

  const typeProperties = [...parentType.getProperties()].sort(
    comparePropertyNames
  );
  for (const property of typeProperties) {
    try {
      if (def.properties![property.name]) {
        continue;
      }

      if (!property.type) {
        throw new Error(`missing type for property: ${property.name}`);
      }

      if (property.name === ts.InternalSymbolName.Index) {
        def.additionalProperties = createDefinitionForTypes(
          property.type.types,
          definitions,
          genericTypes,
          options
        );
        continue;
      }

      const propertyType = resolveType(property.type, genericTypes);
      const refTag = findTag(property.jsDocs, "ref");
      let p: JSONSchema7;
      if (refTag) {
        p = {
          $ref: refTag.comment,
        };
      } else {
        p = createDefinitionForType(
          propertyType,
          definitions,
          genericTypes,
          options
        );
      }
      updateWithJsDocs(property, p, options);

      def.properties![property.name] = p;

      if (!property.optional) {
        def.required!.push(property.name);
      }
    } catch (err) {
      throw new NestedError(
        `failed on property "${property.name}"`,
        err as Error
      );
    }
  }
}

function createDefinitionForTypes(
  types: readonly Type[],
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): JSONSchema7 {
  const typesDefinitions = types.map((t) =>
    createDefinitionForType(t, definitions, genericTypes, options)
  );

  const isSimpleType = (
    t: JSONSchema7
  ): t is {
    type: JSONSchema7TypeName | JSONSchema7TypeName[];
  } => {
    return Object.keys(t).length === 1 && !!t.type;
  };

  if (typesDefinitions.every(isSimpleType)) {
    return { type: typesDefinitions.flatMap((t) => t.type) };
  }
  throw new Error("unhandled, multiple complex types");
}

function comparePropertyNames(a: Property, b: Property): number {
  return a.name > b.name ? 1 : -1;
}

function createTypeName(type: Type): string {
  let name = type.name;
  if (name === "Number" || name === "String" || name === "Boolean") {
    name = name.toLocaleLowerCase();
  }

  const genericArguments = type.getTypeArguments();
  if (genericArguments?.length > 0) {
    name += "<";
    name += genericArguments.map((t) => createTypeName(t));
    name += ">";
  }
  return name;
}

function resolveType(type: Type, genericTypes: Record<string, Type>): Type {
  if (type.kind === TypeKind.TypeParameter) {
    const genericType = genericTypes[type.name];
    if (!genericType) {
      throw new Error(
        `Could not find type parameter ${type.name} from [${Object.keys(
          genericTypes
        ).join(",")}]`
      );
    }
    return genericType;
  }
  return type;
}

function getJsonSchemaTypeNameFromLiteralValue(
  value: any
): JSONSchema7TypeName {
  if (typeof value === "number") {
    return "number";
  }
  if (typeof value === "string") {
    return "string";
  }
  throw new Error(
    `could not get type name from literal value: ${value} (type: ${typeof value})`
  );
}

function getTypeNameFromType(
  type: Type
): JSONSchema7TypeName | JSONSchema7TypeName[] | undefined {
  if (type.kind === TypeKind.LiteralType) {
    return getJsonSchemaTypeNameFromLiteralValue(type.literalValue);
  } else if (type.fullName === "String" || type.fullName === "string") {
    return "string";
  } else if (type.fullName === "Number" || type.fullName === "number") {
    return "number";
  } else if (type.fullName === "Boolean" || type.fullName === "boolean") {
    return "boolean";
  } else if (type.fullName === "undefined") {
    return "null";
  } else {
    throw new Error(`unhandled type: ${type.fullName}`);
  }
}

function getGenericTypeMap(type: Type): Record<string, Type> {
  const typeArguments = type.getTypeArguments();
  const typeParameters = type.getTypeParameters();
  if (!typeArguments || !typeParameters) {
    return {};
  }
  const results: Record<string, Type> = {};
  for (let i = 0; i < typeArguments.length; i++) {
    const typeArgument = typeArguments[i];
    const typeParameter = typeParameters[i];
    if (!typeArgument || !typeParameter) {
      continue;
    }
    results[typeParameter.name] = typeArgument;
  }
  return results;
}

function findTag(
  jsDocs: readonly JsDoc[] | undefined,
  tagName: string
): JsDocTag | undefined {
  for (const jsDoc of jsDocs || []) {
    for (const tag of jsDoc.tags || []) {
      if (tag.tagName === tagName) {
        return tag;
      }
    }
  }
  return undefined;
}
