import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyType as ArrayMaxItemsOptionalMyType } from "./valid/array-max-items-optional/main";
import { MyType as ArrayMinItems1MyType } from "./valid/array-min-items-1/main";
import { MyType as ArrayMinItems2MyType } from "./valid/array-min-items-2/main";
import { MyType as ArrayMinMaxItemsMyType } from "./valid/array-min-max-items/main";
import { MyType as ArrayMinMaxItemsOptionalMyType } from "./valid/array-min-max-items-optional/main";

describe("valid-array", () => {
  test("array-max-items-optional", () => {
    assertValidSchema(
      "valid/array-max-items-optional",
      getType<ArrayMaxItemsOptionalMyType>()
    );
  });

  test("array-min-items-1", () => {
    assertValidSchema(
      "valid/array-min-items-1",
      getType<ArrayMinItems1MyType>()
    );
  });

  test("array-min-items-2", () => {
    assertValidSchema(
      "valid/array-min-items-2",
      getType<ArrayMinItems2MyType>()
    );
  });

  test("array-min-max-items", () => {
    assertValidSchema(
      "valid/array-min-max-items",
      getType<ArrayMinMaxItemsMyType>()
    );
  });

  test("array-min-max-items-optional", () => {
    assertValidSchema(
      "valid/array-min-max-items-optional",
      getType<ArrayMinMaxItemsOptionalMyType>()
    );
  });
});
