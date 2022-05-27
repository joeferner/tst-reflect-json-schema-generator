import { Type } from "tst-reflect";
import fs from "fs";
import path from "path";
import { createJsonSchema, Options } from "../src";

export function assertValidSchema(
  schemaPath: string,
  type: Type | Type[],
  options?: Options
): void {
  const expected = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "..", schemaPath, "schema.json"),
      "utf-8"
    )
  );
  const found = createJsonSchema(type, options);
  expect(found).toEqual(expected);
}
