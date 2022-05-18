import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as EnumsMemberMyObject } from "./valid/enums-member/main";
import { Enum as EnumsNumberEnum } from "./valid/enums-number/main";
import { Enum as EnumsStringEnum } from "./valid/enums-string/main";

describe("valid-enums", () => {
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
