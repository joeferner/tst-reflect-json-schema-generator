import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
// import { MyObject as GenericAnonymousMyObject } from "./valid/generic-anonymous/main";
import { MyObject as GenericArraysMyObject } from "./valid/generic-arrays/main";
// import { MyObject as GenericDefaultMyObject } from "./valid/generic-default/main";
// import { MyObject as GenericHellMyObject } from "./valid/generic-hell/main";
import { MyObject as GenericMultiargsMyObject } from "./valid/generic-multiargs/main";
import { MyObject as GenericMultipleMyObject } from "./valid/generic-multiple/main";
import { MyObject as GenericNestedMyObject } from "./valid/generic-nested/main";
// import { MyObject as GenericPrefixedNumberMyObject } from "./valid/generic-prefixed-number/main";
// import { MyObject as GenericRecursiveMyObject } from "./valid/generic-recursive/main";
import { MyObject as GenericSimpleMyObject } from "./valid/generic-simple/main";
import { MyObject as GenericVoidMyObject } from "./valid/generic-void/main";

describe("valid-generic", () => {
  // TODO
  // test("generic-anonymous", () => {
  //   assertValidSchema(
  //     "valid/generic-anonymous",
  //     getType<GenericAnonymousMyObject>()
  //   );
  // });

  test("generic-arrays", () => {
    assertValidSchema("valid/generic-arrays", getType<GenericArraysMyObject>());
  });

  // TODO
  // test("generic-default", () => {
  //   assertValidSchema(
  //     "valid/generic-default",
  //     getType<GenericDefaultMyObject>()
  //   );
  // });

  // TODO
  // test("generic-hell", () => {
  //   assertValidSchema("valid/generic-hell", getType<GenericHellMyObject>());
  // });

  test("generic-multiargs", () => {
    assertValidSchema(
      "valid/generic-multiargs",
      getType<GenericMultiargsMyObject>()
    );
  });

  test("generic-multiple", () => {
    assertValidSchema(
      "valid/generic-multiple",
      getType<GenericMultipleMyObject>()
    );
  });

  test("generic-nested", () => {
    assertValidSchema("valid/generic-nested", getType<GenericNestedMyObject>());
  });

  // TODO
  // test("generic-prefixed-number", () => {
  //   assertValidSchema(
  //     "valid/generic-prefixed-number",
  //     getType<GenericPrefixedNumberMyObject>()
  //   );
  // });

  // TODO
  // test("generic-recursive", () => {
  //   assertValidSchema(
  //     "valid/generic-recursive",
  //     getType<GenericRecursiveMyObject>()
  //   );
  // });

  test("generic-simple", () => {
    assertValidSchema("valid/generic-simple", getType<GenericSimpleMyObject>());
  });

  test("generic-void", () => {
    assertValidSchema("valid/generic-void", getType<GenericVoidMyObject>());
  });
});
