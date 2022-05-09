import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as InterfaceSingleMyObject } from "./valid/interface-single/main";
import { MyObject as InterfaceMultiMyObject } from "./valid/interface-multi/main";
import { MyObject as InterfaceExtraPropsMyObject } from "./valid/interface-extra-props/main";
// TODO import { MyObject as AnnotationCommentMyObject } from "./valid/annotation-comment/main";

describe("valid", () => {
  // TODO
  // it(
  //   "annotation-comment",
  //   assertValidSchema(
  //     "valid/annotation-comment",
  //     getType<AnnotationCommentMyObject>()
  //   )
  // );

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
