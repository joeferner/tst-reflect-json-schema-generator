import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
// import { MyObject as ImportAnonymousMyObject } from "./valid/import-anonymous/main";
// import { MyObject as ImportExposedMyObject } from "./valid/import-exposed/main";
// import { MyObject as ImportInternalMyObject } from "./valid/import-internal/main";
// import { MyObject as ImportSimpleMyObject } from "./valid/import-simple/main";
// import { TagArray as InterfaceArrayMyObject } from "./valid/interface-array/main";
// import { MyObject as InterfaceComputedPropertyNameMyObject } from "./valid/interface-computed-property-name/main";
// import { MyObject as InterfaceExtendedExtraPropsMyObject } from "./valid/interface-extended-extra-props/main";
import { MyObject as InterfaceExtraPropsMyObject } from "./valid/interface-extra-props/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";
import { MyObject as InterfacePropertyDashMyObject } from "./valid/interface-property-dash/main";
import { MyObject as InterfaceRecursionMyObject } from "./valid/interface-recursion/main";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";

describe("valid-interface", () => {
  // TODO
  // test("import-anonymous", () => {
  //   assertValidSchema(
  //     "valid/import-anonymous",
  //     getType<ImportAnonymousMyObject>()
  //   );
  // });

  // TODO
  // test("import-exposed", () => {
  //   assertValidSchema(
  //     "valid/import-exposed",
  //     getType<ImportExposedMyObject>()
  //   );
  // });

  // TODO
  // test("import-internal", () => {
  //   assertValidSchema(
  //     "valid/import-internal",
  //     getType<ImportInternalMyObject>()
  //   );
  // });

  // TODO
  // test("import-simple", () => {
  //   assertValidSchema(
  //     "valid/import-simple",
  //     getType<ImportSimpleMyObject>()
  //   );
  // });

  // TODO
  // test("interface-array", () => {
  //   assertValidSchema(
  //     "valid/interface-array",
  //     getType<InterfaceArrayMyObject>()
  //   );
  // });

  // TODO
  // test("interface-computed-property-name", () => {
  //   assertValidSchema(
  //     "valid/interface-computed-property-name",
  //     getType<InterfaceComputedPropertyNameMyObject>()
  //   );
  // });

  // TODO
  // test("interface-extended-extra-props", () => {
  //   assertValidSchema(
  //     "valid/interface-extended-extra-props",
  //     getType<InterfaceExtendedExtraPropsMyObject>()
  //   );
  // });

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

  test("interface-property-dash", () => {
    assertValidSchema(
      "valid/interface-property-dash",
      getType<InterfacePropertyDashMyObject>()
    );
  });

  test("interface-recursion", () => {
    assertValidSchema(
      "valid/interface-recursion",
      getType<InterfaceRecursionMyObject>()
    );
  });

  test("interface-single", () => {
    assertValidSchema(
      "valid/interface-single",
      getType<InterfaceSingleMyObject>()
    );
  });
});
