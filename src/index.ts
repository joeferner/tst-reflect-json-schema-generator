import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { Type, TypeKind } from "tst-reflect";
import { createDefinitionForType } from "./createDefinitionForType";

export interface Options {
  extraTags?: string[];
  schemaId?: string;
}

export const DEFAULT_OPTIONS: Options = {};

export function createJsonSchema(
  type: Type | Type[],
  options?: Options
): JSONSchema7 {
  options = { ...DEFAULT_OPTIONS, ...options };

  const definitions: Record<string, JSONSchema7Definition> = {};
  if (Array.isArray(type)) {
    for (const t of type) {
      createDefinitionForType(t, definitions, {}, options);
    }
  } else {
    createDefinitionForType(type, definitions, {}, options);
  }

  const result: JSONSchema7 = {
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions,
  };
  if (!Array.isArray(type)) {
    result.$ref = `#/definitions/${encodeURIComponent(type.name)}`;
  }
  if (options.schemaId) {
    result.$id = options.schemaId;
  }
  return result;
}

export function resolveType(
  type: Type,
  genericTypes: Record<string, Type>
): Type {
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

export function getJsonSchemaTypeNameFromLiteralValue(
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
