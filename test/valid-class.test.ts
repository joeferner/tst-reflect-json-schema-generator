import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as ClassExtraPropsMyObject } from "./valid/class-extra-props/main";
import { MyObject as ClassGenericsMyObject } from "./valid/class-generics/main";
import { MyObject as ClassInheritanceMyObject } from "./valid/class-inheritance/main";
import { MyObject as ClassJsdocMyObject } from "./valid/class-jsdoc/main";
import { MyObject as ClassMultiMyObject } from "./valid/class-multi/main";
import { MyObject as ClassRecursionMyObject } from "./valid/class-recursion/main";
import { MyObject as ClassSingleMyObject } from "./valid/class-single/main";

describe("valid-class", () => {
  test("class-extra-props", () => {
    assertValidSchema(
      "valid/class-extra-props",
      getType<ClassExtraPropsMyObject>()
    );
  });

  test("class-generics", () => {
    assertValidSchema("valid/class-generics", getType<ClassGenericsMyObject>());
  });

  test("class-inheritance", () => {
    assertValidSchema(
      "valid/class-inheritance",
      getType<ClassInheritanceMyObject>()
    );
  });

  test("class-jsdoc", () => {
    assertValidSchema(
      "valid/class-jsdoc",
      getType<ClassJsdocMyObject>()
    );
  });

  test("class-multi", () => {
    assertValidSchema(
      "valid/class-multi",
      getType<ClassMultiMyObject>()
    );
  });

  test("class-recursion", () => {
    assertValidSchema(
      "valid/class-recursion",
      getType<ClassRecursionMyObject>()
    );
  });

  test("class-single", () => {
    assertValidSchema(
      "valid/class-single",
      getType<ClassSingleMyObject>()
    );
  });
});
