import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";
import { MyObject as AnnotationCommentMyObject } from "./valid/annotation-comment/main";
import { MyObject as TypeExtendMyObject } from "./valid/type-extend/main";
import { MyObject as ClassInheritanceMyObject } from "./valid/class-inheritance/main";
import { MyObject as ClassGenericsMyObject } from "./valid/class-generics/main";
import { MyObject as GenericSimpleMyObject } from "./valid/generic-simple/main";
import { MyObject as GenericMultiargsMyObject } from "./valid/generic-multiargs/main";
import { MyObject as EnumsMemberMyObject } from "./valid/enums-member/main";
import { MyObject as GenericArraysMyObject } from "./valid/generic-arrays/main";
import { MyObject as GenericNestedMyObject } from "./valid/generic-nested/main";
import { MyObject as InterfaceExtraPropsMyObject } from "./valid/interface-extra-props/main";
import { Enum as EnumsStringEnum } from "./valid/enums-string/main";
import { Enum as EnumsNumberEnum } from "./valid/enums-number/main";
import { Enum as EnumsMixedEnum } from "./valid/enums-mixed/main";

const skipTstReflectError = true;

describe("valid", () => {
  test("annotation-comment", () => {
    assertValidSchema(
      "valid/annotation-comment",
      getType<AnnotationCommentMyObject>()
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

  test("enums-member", () => {
    assertValidSchema("valid/enums-member", getType<EnumsMemberMyObject>());
  });

  if (!skipTstReflectError) {
    test("enums-mixed", () => {
      assertValidSchema("valid/enums-mixed", getType<EnumsMixedEnum>());
    });
  }

  test("enums-number", () => {
    assertValidSchema("valid/enums-number", getType<EnumsNumberEnum>());
  });

  test("enums-string", () => {
    assertValidSchema("valid/enums-string", getType<EnumsStringEnum>());
  });

  test("generic-arrays", () => {
    assertValidSchema("valid/generic-arrays", getType<GenericArraysMyObject>());
  });

  test("generic-multiargs", () => {
    assertValidSchema(
      "valid/generic-multiargs",
      getType<GenericMultiargsMyObject>()
    );
  });

  test("generic-nested", () => {
    assertValidSchema("valid/generic-nested", getType<GenericNestedMyObject>());
  });

  test("generic-simple", () => {
    assertValidSchema("valid/generic-simple", getType<GenericSimpleMyObject>());
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
