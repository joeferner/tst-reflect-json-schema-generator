import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
// import { MyObject as ImportAnonymousMyObject } from "./valid/import-anonymous/main";
import { MyObject as ImportExposedMyObject } from "./valid/import-exposed/main";
// import { MyObject as ImportInternalMyObject } from "./valid/import-internal/main";
import { MyObject as ImportSimpleMyObject } from "./valid/import-simple/main";

describe("valid-import", () => {
  // TODO
  // test("import-anonymous", () => {
  //   assertValidSchema(
  //     "valid/import-anonymous",
  //     getType<ImportAnonymousMyObject>()
  //   );
  // });

  test("import-exposed", () => {
    assertValidSchema("valid/import-exposed", getType<ImportExposedMyObject>());
  });

  // TODO
  // test("import-internal", () => {
  //   assertValidSchema(
  //     "valid/import-internal",
  //     getType<ImportInternalMyObject>()
  //   );
  // });

  test("import-simple", () => {
    assertValidSchema("valid/import-simple", getType<ImportSimpleMyObject>());
  });
});
