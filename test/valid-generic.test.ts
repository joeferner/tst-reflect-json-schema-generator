import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as GenericArraysMyObject } from "./valid/generic-arrays/main";
import { MyObject as GenericMultiargsMyObject } from "./valid/generic-multiargs/main";
import { MyObject as GenericNestedMyObject } from "./valid/generic-nested/main";
import { MyObject as GenericSimpleMyObject } from "./valid/generic-simple/main";

describe("valid-generic", () => {
  test("generic-arrays", () => {
    assertValidSchema("valid/generic-arrays", getType<GenericArraysMyObject>());
  });

  test("generic-multiargs", () => {
    assertValidSchema(
      "valid/generic-multiargs",
      getType<GenericMultiargsMyObject>()
    );
  });

  test("generic-nested", () => {
    assertValidSchema("valid/generic-nested", getType<GenericNestedMyObject>());
  });

  test("generic-simple", () => {
    assertValidSchema("valid/generic-simple", getType<GenericSimpleMyObject>());
  });
});
