import { JSONSchema6, JSONSchema6Definition } from "json-schema";
import { Type, TypeKind } from "tst-reflect";

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
): JSONSchema6Definition {
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

  const ref: JSONSchema6Definition = {
    $ref: `#/definitions/${type.name}`,
  };

  if (definitions[type.name]) {
    return ref;
  }

  const properties: Record<string, JSONSchema6Definition> = {};
  const required: string[] = [];
  const def: JSONSchema6Definition = {
    type: "object",
    additionalProperties: false,
    properties,
    required,
  };

  for (const property of type.getProperties()) {
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

const a = {
  MyObject: {
    additionalProperties: false,
    properties: {
      propA: {
        type: "number",
      },
      propB: {
        type: "number",
      },
      propC: {
        type: "string",
      },
    },
    required: ["propA", "propB", "propC"],
  },
};
