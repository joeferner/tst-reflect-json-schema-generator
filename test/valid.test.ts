import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";

describe("valid", () => {
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
