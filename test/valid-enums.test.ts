import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
// import { Enum as EnumsComputeEnum } from "./valid/enums-compute/main";
import { Enum as EnumsInitializedEnum } from "./valid/enums-initialized/main";
import { MyObject as EnumsMemberMyObject } from "./valid/enums-member/main";
import { Enum as EnumsNumberEnum } from "./valid/enums-number/main";
import { Enum as EnumsStringEnum } from "./valid/enums-string/main";

describe("valid-enums", () => {
  // TODO evaluate literal expressions to get values
  // test("enums-compute", () => {
  //   assertValidSchema("valid/enums-compute", getType<EnumsComputeEnum>());
  // });

  test("enums-initialized", () => {
    assertValidSchema(
      "valid/enums-initialized",
      getType<EnumsInitializedEnum>()
    );
  });

  test("enums-member", () => {
    assertValidSchema("valid/enums-member", getType<EnumsMemberMyObject>());
  });

  test("enums-number", () => {
    assertValidSchema("valid/enums-number", getType<EnumsNumberEnum>());
  });

  test("enums-string", () => {
    assertValidSchema("valid/enums-string", getType<EnumsStringEnum>());
  });
});
