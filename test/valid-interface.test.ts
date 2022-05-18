import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as InterfaceExtraPropsMyObject } from "./valid/interface-extra-props/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";

describe("valid-interface", () => {
  test("interface-extra-props", () => {
    assertValidSchema(
      "valid/interface-extra-props",
      getType<InterfaceExtraPropsMyObject>()
    );
  });

  test("interface-multi", () => {
    assertValidSchema(
      "valid/interface-multi",
      getType<InterfaceMultiMyObject>()
    );
  });

  test("interface-single", () => {
    assertValidSchema(
      "valid/interface-single",
      getType<InterfaceSingleMyObject>()
    );
  });
});
