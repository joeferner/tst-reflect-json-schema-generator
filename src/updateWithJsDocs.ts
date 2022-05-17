import { JSONSchema7 } from "json-schema";
import { Property, Type, JsDocTag } from "tst-reflect";
import json5 from "json5";

const REQUIRES_DOLLAR = new Set<string>(["id", "comment", "ref"]);

const TEXT_TAGS = new Set<string>([
  "title",
  "description",
  "id",

  "format",
  "pattern",
  "ref",

  // New since draft-07:
  "comment",
  "contentMediaType",
  "contentEncoding",
]);

const JSON_TAGS = new Set<string>([
  "minimum",
  "exclusiveMinimum",

  "maximum",
  "exclusiveMaximum",

  "multipleOf",

  "minLength",
  "maxLength",

  "minProperties",
  "maxProperties",

  "minItems",
  "maxItems",
  "uniqueItems",

  "propertyNames",
  "contains",
  "const",
  "examples",

  "default",

  // New since draft-07:
  "if",
  "then",
  "else",
  "readOnly",
  "writeOnly",

  // New since draft 2019-09:
  "deprecated",
]);

export interface UpdateWithJsDocsOptions {
  extraTags?: string[];
}

export function updateWithJsDocs(
  type: Type | Property,
  def: JSONSchema7,
  options: UpdateWithJsDocsOptions
): void {
  if (type.jsDocs && type.jsDocs.length > 0) {
    type.jsDocs
      .flatMap((d) => d.tags)
      .forEach((t: JsDocTag | undefined) => {
        if (!t || !t.tagName) {
          return;
        }
        (def as any)[getName(t)] = getValue(t, options);
      });

    if (!def.description) {
      const description = type.jsDocs
        .flatMap((d) => d.comment)
        .join("\n")
        ?.trim();
      if (description && description.length > 0) {
        def.description = description;
      }
    }
  }
}

function getName(t: JsDocTag): string {
  let name = t.tagName || "";
  if (REQUIRES_DOLLAR.has(name)) {
    name = "$" + name;
  }
  return name;
}

function getValue(t: JsDocTag, options: UpdateWithJsDocsOptions): any {
  const tagName = t.tagName || "";
  const isTextTag = TEXT_TAGS.has(tagName);
  // Non-text tags without explicit value (e.g. `@deprecated`) default to `true`.
  const defaultText = isTextTag ? "" : "true";
  const text = t.comment || defaultText;

  if (isTextTag) {
    return text;
  } else if (JSON_TAGS.has(tagName)) {
    return parseJson(text) ?? text;
  } else if (options.extraTags?.includes(tagName)) {
    return parseJson(text) ?? text;
  } else {
    // Unknown jsDoc tag.
    return undefined;
  }
}

function parseJson(value: string): any {
  try {
    return json5.parse(value);
  } catch (e) {
    return undefined;
  }
}
