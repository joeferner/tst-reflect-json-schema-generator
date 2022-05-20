import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyType as ArrayMaxItemsOptionalMyType } from "./valid/array-max-items-optional/main";

describe("valid-array", () => {
  test("array-max-items-optional", () => {
    debugger;
    assertValidSchema(
      "valid/array-max-items-optional",
      getType<ArrayMaxItemsOptionalMyType>()
    );
  });
});
