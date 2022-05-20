import { JSONSchema7 } from "json-schema";
import { JsDoc, JsDocTag, Type, TypeKind } from "tst-reflect";

export function findTag(
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

export function isOptionalType(type: Type): boolean {
  // TODO need better checks
  return type.kind == TypeKind.Container && type.isUnion();
}

export function collapseSameSchemas(schemas: JSONSchema7[]): JSONSchema7[] {
  const results: JSONSchema7[] = [];
  for (const schema of schemas) {
    if (results.length === 0) {
      results.push(schema);
      continue;
    }
    if (!findSameSchema(results, schema)) {
      results.push(schema);
    }
  }
  return results;
}

export function findSameSchema(
  schemas: JSONSchema7[],
  schema: JSONSchema7
): JSONSchema7 | undefined {
  for (const s of schemas) {
    if (isSameSchema(schema, s)) {
      return s;
    }
  }
  return undefined;
}

export function isSameSchema(
  schemaA: JSONSchema7,
  schemaB: JSONSchema7
): boolean {
  const keysA = Object.keys(schemaA);
  const keysB = Object.keys(schemaB);
  // TODO replace with deep equals function
  if (keysA.length !== keysB.length) {
    return false;
  }
  return schemaA.type === schemaB.type;
}
