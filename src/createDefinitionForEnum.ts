import {
  JSONSchema7Definition,
  JSONSchema7Type,
  JSONSchema7TypeName,
} from "json-schema";
import { Type } from "tst-reflect";
import { getJsonSchemaTypeNameFromLiteralValue } from ".";

export function createDefinitionForEnum(type: Type): JSONSchema7Definition {
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
