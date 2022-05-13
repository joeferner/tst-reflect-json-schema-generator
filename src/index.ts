import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema";
import NestedError from "nested-error-stacks";
import { Property, Type, TypeKind } from "tst-reflect";
import ts from "typescript";

export function createJsonSchema(type: Type): JSONSchema7 {
  const definitions: Record<string, JSONSchema7Definition> = {};
  createDefinitionForType(type, undefined, definitions);

  return {
    $ref: `#/definitions/${encodeURIComponent(type.name)}`,
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions,
  };
}

function createDefinitionForType(
  type: Type,
  genericArguments: ReadonlyArray<Type> | undefined,
  definitions: Record<string, JSONSchema7Definition>
): JSONSchema7 {
  if (
    type.fullName === "String" ||
    type.fullName === "string" ||
    type.fullName === "Number" ||
    type.fullName === "number" ||
    type.fullName === "Boolean" ||
    type.fullName === "boolean" ||
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

  if (
    type.kind == TypeKind.Container &&
    type.fullName === "optional" &&
    type.baseType?.fullName === "Object" &&
    type.isUnion()
  ) {
    const types = type.types.filter((t) => t.fullName !== "undefined");

    const onlyType = types[0];
    if (types.length === 1 && onlyType) {
      return createDefinitionForType(onlyType, genericArguments, definitions);
    }
    throw new Error("unhandled type");
  }

  const ref: JSONSchema7 = createRef(type, genericArguments);
  const typeName = createTypeName(type, genericArguments);
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

  const comment = getComment(type);
  if (comment) {
    def.$comment = comment;
  }

  for (
    let t: Type | undefined = type, tGenericArguments = genericArguments;
    t;
    tGenericArguments = t?.baseTypeGenericArguments, t = t.baseType
  ) {
    updateProperties(t, tGenericArguments, def, definitions);
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

function createRef(
  type: Type,
  genericArguments: readonly Type[] | undefined
): JSONSchema7 {
  return {
    $ref: `#/definitions/${encodeURIComponent(
      createTypeName(type, genericArguments)
    )}`,
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
  type: Type,
  genericArguments: ReadonlyArray<Type> | undefined,
  def: JSONSchema7,
  definitions: Record<string, JSONSchema7Definition>
): void {
  const typeProperties = [...type.getProperties()].sort(comparePropertyNames);
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
          definitions
        );
        continue;
      }

      const p = createDefinitionForType(
        resolveType(property.type, type.getTypeParameters(), genericArguments),
        property.genericArguments,
        definitions
      );

      const comment = getComment(property);
      if (comment) {
        p.$comment = comment;
      }

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
  definitions: Record<string, JSONSchema7Definition>
): JSONSchema7 {
  const typesDefinitions = types.map((t) =>
    createDefinitionForType(t, undefined, definitions)
  );
  if (typesDefinitions.every(isSimpleType)) {
    return { type: typesDefinitions.flatMap((t) => t.type) };
  }
  throw new Error("unhandled, multiple complex types");
}

function isSimpleType(t: JSONSchema7): t is {
  type: JSONSchema7TypeName | JSONSchema7TypeName[];
} {
  return Object.keys(t).length === 1 && !!t.type;
}

function getComment(type: Type | Property): string | undefined {
  if (type.jsDocs && type.jsDocs.length > 0) {
    return type.jsDocs
      .flatMap((d) => d.tags)
      .filter((t) => t?.comment && t?.tagName === "comment")
      .map((t) => t?.comment)
      .join("\n");
  }
  return undefined;
}

function comparePropertyNames(a: Property, b: Property): number {
  return a.name > b.name ? 1 : -1;
}

function createTypeName(
  type: Type,
  genericArguments?: readonly Type[]
): string {
  let name = type.name;
  if (name === "Number" || name === "String" || name === "Boolean") {
    name = name.toLocaleLowerCase();
  }

  if (genericArguments) {
    name += "<";
    name += genericArguments.map((t) => createTypeName(t));
    name += ">";
  }
  return name;
}

function resolveType(
  type: Type,
  typeParameters: readonly Type[],
  genericArguments: readonly Type[] | undefined
): Type {
  if (type.kind === TypeKind.TypeParameter) {
    const typeParameterIndex = typeParameters.findIndex(
      (t) => type.name === t.name
    );
    if (typeParameterIndex < 0) {
      throw new Error(
        `Could not find type parameter ${type.name} from [${typeParameters.map(
          (tp) => tp.name
        )}]`
      );
    }
    const genericArgument = genericArguments?.[typeParameterIndex];
    if (!genericArgument) {
      throw new Error(
        `Could not find type argument ${
          type.name
        } from [${genericArguments?.map((tp) => tp.name)}]`
      );
    }
    return genericArgument;
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
  } else {
    throw new Error(`unhandled type: ${type.fullName}`);
  }
}
