import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";
import { MyObject as InterfaceExtraPropsMyObject } from "./valid/interface-extra-props/main";
import { MyObject as AnnotationCommentMyObject } from "./valid/annotation-comment/main";
import { MyObject as TypeExtendMyObject } from "./valid/type-extend/main";
import { MyObject as ClassInheritanceMyObject } from "./valid/class-inheritance/main";

describe("valid", () => {
  test("annotation-comment", () => {
    assertValidSchema(
      "valid/annotation-comment",
      getType<AnnotationCommentMyObject>()
    );
  });

  test("class-inheritance", () => {
    assertValidSchema(
      "valid/class-inheritance",
      getType<ClassInheritanceMyObject>()
    );
  });

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

  test("type-extend", () => {
    assertValidSchema("valid/type-extend", getType<TypeExtendMyObject>());
  });
});
