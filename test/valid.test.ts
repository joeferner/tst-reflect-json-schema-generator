import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as AnyUnknownMyObject } from "./valid/any-unknown/main";
import {
  A as IgnoreExportA,
  B as IgnoreExportB,
} from "./valid/ignore-export/main";

describe("valid", () => {
  test("any-unknown", () => {
    assertValidSchema("valid/any-unknown", getType<AnyUnknownMyObject>());
  });

  test("ignore-export", () => {
    assertValidSchema("valid/ignore-export", [
      getType<IgnoreExportA>(),
      getType<IgnoreExportB>(),
    ]);
  });

  test("ignore-export", () => {
    assertValidSchema("valid/ignore-export", [
      getType<IgnoreExportA>(),
      getType<IgnoreExportB>(),
    ]);
  });
});
