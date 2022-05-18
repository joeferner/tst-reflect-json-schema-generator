import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as AnyUnknownMyObject } from "./valid/any-unknown/main";

describe("valid", () => {
  test("any-unknown", () => {
    assertValidSchema("valid/any-unknown", getType<AnyUnknownMyObject>());
  });
});
