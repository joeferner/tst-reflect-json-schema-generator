import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { Type, TypeKind } from "tst-reflect";
import { getJsonSchemaTypeNameFromLiteralValue, Options, resolveType } from ".";
import { createDefinitionForArray } from "./createDefinitionForArray";
import { createDefinitionForEnum } from "./createDefinitionForEnum";
import { updateProperties } from "./updateProperties";
import { updateWithJsDocs } from "./updateWithJsDocs";
import { isOptionalType } from "./utils";

export function createDefinitionForType(
  type: Type,
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): JSONSchema7 {
  type = resolveType(type, genericTypes);

  if (type.isArray()) {
    const def = createDefinitionForArray(
      type,
      definitions,
      genericTypes,
      options
    );
    if (type.name && type.getProperties().length > 0) {
      definitions[type.name] = def;
    } else {
      return def;
    }
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
  if (isOptionalType(type)) {
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
  definitions[typeName] = {};

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

  updateWithJsDocs(undefined, type, def, options);

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
