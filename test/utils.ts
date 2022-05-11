import { Type } from "tst-reflect";
import fs from "fs";
import path from "path";
import { createJsonSchema } from "../src";

export function assertValidSchema(schemaPath: string, type: Type): void {
  const expected = JSON.parse(
    fs.readFileSync(path.join(__dirname, schemaPath, "schema.json"), "utf-8")
  );
  const found = createJsonSchema(type);
  expect(found).toEqual(expected);
}
