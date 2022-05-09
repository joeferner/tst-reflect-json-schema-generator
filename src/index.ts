import {
  JSONSchema6,
  JSONSchema6Definition,
  JSONSchema6TypeName,
} from "json-schema";
import { Type, TypeKind } from "tst-reflect";
import ts from "typescript";

export function createJsonSchema(type: Type): JSONSchema6 {
  const definitions: Record<string, JSONSchema6Definition> = {};
  createDefinitionForType(type, definitions);

  return {
    $ref: `#/definitions/${type.name}`,
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions,
  };
}

function createDefinitionForType(
  type: Type,
  definitions: Record<string, JSONSchema6Definition>
): JSONSchema6 {
  if (type.fullName === "String") {
    return { type: "string" };
  }

  if (type.fullName === "Number") {
    return { type: "number" };
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
      return createDefinitionForType(onlyType, definitions);
    }
    throw new Error("unhandled type");
  }

  const ref: JSONSchema6 = {
    $ref: `#/definitions/${type.name}`,
  };

  if (definitions[type.name]) {
    return ref;
  }

  const properties: Record<string, JSONSchema6Definition> = {};
  const required: string[] = [];
  const def: JSONSchema6 = {
    type: "object",
    additionalProperties: false,
    properties,
    required,
  };

  for (const property of type.getProperties()) {
    if (property.name === ts.InternalSymbolName.Index) {
      def.additionalProperties = createDefinitionForTypes(
        property.type.types,
        definitions
      );
      continue;
    }
    properties[property.name] = createDefinitionForType(
      property.type,
      definitions
    );
    if (!property.optional) {
      required.push(property.name);
    }
  }

  definitions[type.name] = def;
  return ref;
}

function createDefinitionForTypes(
  types: readonly Type[],
  definitions: Record<string, JSONSchema6Definition>
): JSONSchema6 {
  const typesDefinitions = types.map((t) =>
    createDefinitionForType(t, definitions)
  );
  if (typesDefinitions.every(isSimpleType)) {
    return { type: typesDefinitions.flatMap((t) => t.type) };
  }
  throw new Error("unhandled, multiple complex types");
}

function isSimpleType(t: JSONSchema6): t is {
  type: JSONSchema6TypeName | JSONSchema6TypeName[];
} {
  return Object.keys(t).length === 1 && !!t.type;
}
