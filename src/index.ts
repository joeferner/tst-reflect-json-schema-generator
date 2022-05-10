import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { Property, Type, TypeKind } from "tst-reflect";
import ts from "typescript";

export function createJsonSchema(type: Type): JSONSchema7 {
  const definitions: Record<string, JSONSchema7Definition> = {};
  createDefinitionForType(type, definitions);

  return {
    $ref: `#/definitions/${type.name}`,
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions,
  };
}

function createDefinitionForType(
  type: Type,
  definitions: Record<string, JSONSchema7Definition>
): JSONSchema7 {
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

  const ref: JSONSchema7 = {
    $ref: `#/definitions/${type.name}`,
  };

  if (definitions[type.name]) {
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

  for (const property of type.getProperties()) {
    if (property.name === ts.InternalSymbolName.Index) {
      def.additionalProperties = createDefinitionForTypes(
        property.type.types,
        definitions
      );
      continue;
    }

    const p = createDefinitionForType(property.type, definitions);

    const comment = getComment(property);
    if (comment) {
      p.$comment = comment;
    }

    properties[property.name] = p;

    if (!property.optional) {
      required.push(property.name);
    }
  }

  definitions[type.name] = def;
  return ref;
}

function createDefinitionForTypes(
  types: readonly Type[],
  definitions: Record<string, JSONSchema7Definition>
): JSONSchema7 {
  const typesDefinitions = types.map((t) =>
    createDefinitionForType(t, definitions)
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
