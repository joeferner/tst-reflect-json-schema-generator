import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as TypeExtendMyObject } from "./valid/type-extend/main";

describe("valid-type", () => {
  test("type-extend", () => {
    assertValidSchema("valid/type-extend", getType<TypeExtendMyObject>());
  });
});
