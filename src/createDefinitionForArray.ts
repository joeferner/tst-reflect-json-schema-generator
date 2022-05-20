import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { Type } from "tst-reflect";
import { createDefinitionForType, Options } from ".";
import { collapseSameSchemas, isOptionalType } from "./utils";

export function createDefinitionForArray(
  type: Type,
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): JSONSchema7 {
  const typeArg = type.getTypeArguments()[0];
  const properties = type.getProperties();
  if (properties && properties.length > 0) {
    const itemsTypes = collapseSameSchemas(
      properties.map((p) =>
        createDefinitionForType(p.type, definitions, genericTypes, options)
      )
    );
    if (itemsTypes.length !== 1) {
      throw new Error("could not get tuple type");
    }
    return {
      type: "array",
      items: itemsTypes[0],
      minItems: properties.filter((p) => !isOptionalType(p.type)).length,
      maxItems: properties.length,
    };
  } else {
    return {
      type: "array",
      items: typeArg
        ? createDefinitionForType(typeArg, definitions, genericTypes, options)
        : { type: "object" },
    };
  }
}
