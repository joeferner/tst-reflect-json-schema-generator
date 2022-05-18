import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as ClassGenericsMyObject } from "./valid/class-generics/main";
import { MyObject as ClassInheritanceMyObject } from "./valid/class-inheritance/main";

describe("valid-class", () => {
  test("class-generics", () => {
    assertValidSchema("valid/class-generics", getType<ClassGenericsMyObject>());
  });

  test("class-inheritance", () => {
    assertValidSchema(
      "valid/class-inheritance",
      getType<ClassInheritanceMyObject>()
    );
  });
});
