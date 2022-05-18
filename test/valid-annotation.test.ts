import { getType } from "tst-reflect";
import { assertValidSchema } from "./utils";
import { MyObject as AnnotationCommentMyObject } from "./valid/annotation-comment/main";
import { MyObject as AnnotationCustomMyObject } from "./valid/annotation-custom/main";
import { MyObject as AnnotationDeprecatedMyObject } from "./valid/annotation-deprecated/main";
import { MyObject as AnnotationDescriptionOverrideMyObject } from "./valid/annotation-description-override/main";
import { MyObject as AnnotationEmptyMyObject } from "./valid/annotation-empty/main";
import { MyObject as AnnotationExampleMyObject } from "./valid/annotation-example/main";
import { MyObject as AnnotationIdMyObject } from "./valid/annotation-id/main";
import { MyObject as AnnotationReadOnlyMyObject } from "./valid/annotation-readOnly/main";
import { MyObject as AnnotationRefMyObject } from "./valid/annotation-ref/main";
import { MyObject as AnnotationWriteOnlyMyObject } from "./valid/annotation-writeOnly/main";

describe("valid-annotation", () => {
  test("annotation-comment", () => {
    assertValidSchema(
      "valid/annotation-comment",
      getType<AnnotationCommentMyObject>()
    );
  });

  test("annotation-custom", () => {
    assertValidSchema(
      "valid/annotation-custom",
      getType<AnnotationCustomMyObject>(),
      {
        extraTags: [
          "customBooleanProperty",
          "customNumberProperty",
          "customStringProperty",
          "customComplexProperty",
          "customMultilineProperty",
          "customUnquotedProperty",
        ],
      }
    );
  });

  test("annotation-deprecated", () => {
    assertValidSchema(
      "valid/annotation-deprecated",
      getType<AnnotationDeprecatedMyObject>(),
      {
        extraTags: ["deprecationMessage"],
      }
    );
  });

  test("annotation-description-override", () => {
    assertValidSchema(
      "valid/annotation-description-override",
      getType<AnnotationDescriptionOverrideMyObject>(),
      {
        extraTags: ["markdownDescription"],
      }
    );
  });

  test("annotation-empty", () => {
    assertValidSchema(
      "valid/annotation-empty",
      getType<AnnotationEmptyMyObject>(),
      {
        extraTags: ["customEmptyAnnotation"],
      }
    );
  });

  test("annotation-example", () => {
    assertValidSchema(
      "valid/annotation-example",
      getType<AnnotationExampleMyObject>()
    );
  });

  test("annotation-id", () => {
    assertValidSchema("valid/annotation-id", getType<AnnotationIdMyObject>(), {
      schemaId: "Test",
    });
  });

  test("annotation-readOnly", () => {
    assertValidSchema(
      "valid/annotation-readOnly",
      getType<AnnotationReadOnlyMyObject>()
    );
  });

  test("annotation-ref", () => {
    assertValidSchema("valid/annotation-ref", getType<AnnotationRefMyObject>());
  });

  test("annotation-writeOnly", () => {
    assertValidSchema(
      "valid/annotation-writeOnly",
      getType<AnnotationWriteOnlyMyObject>()
    );
  });
});
