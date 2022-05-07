import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";
import { MyObject as InterfaceExtraPropsMyObject } from "./valid/interface-extra-props/main";

describe("valid", () => {
  it(
    "interface-extra-props",
    assertValidSchema(
      "valid/interface-extra-props",
      getType<InterfaceExtraPropsMyObject>()
    )
  );

  it(
    "interface-multi",
    assertValidSchema(
      "valid/interface-multi",
      getType<InterfaceMultiMyObject>()
    )
  );

  it(
    "interface-single",
    assertValidSchema(
      "valid/interface-single",
      getType<InterfaceSingleMyObject>()
    )
  );
});
