import { JSONSchema7 } from "json-schema";
import { Property, Type, JsDocTag, JsDoc } from "tst-reflect";
import json5 from "json5";
import { findJsDocTags } from "./utils";

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
  "example",
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
  parentType: Type | undefined,
  type: Type | Property,
  def: JSONSchema7,
  options: UpdateWithJsDocsOptions
): void {
  type.jsDocs
    ?.flatMap((d) => d.tags)
    ?.forEach((t: JsDocTag | undefined) => {
      if (!t || !t.tagName) {
        return;
      }

      const name = getName(t);
      if (name === "example") {
        try {
          const value = json5.parse(t.comment || "");
          if (def.examples) {
            if (Array.isArray(def.examples)) {
              def.examples.push(value);
            } else {
              def.examples = [def.examples, value];
            }
          } else {
            def.examples = [value];
          }
        } catch (err) {
          // ignore bad examples
        }
      } else {
        (def as any)[name] = getValue(t, options);
      }
    });

  if (!def.description) {
    const descriptions = type.jsDocs?.flatMap((d) => d.comment) ?? [];

    for (const constructor of parentType?.getConstructors() ?? []) {
      const tags = findJsDocTags(constructor.jsDocs, "param");
      for (const tag of tags) {
        if (tag.name === type.name) {
          descriptions.push(tag.comment);
        }
      }
    }

    const description = descriptions.join(" ")?.trim();

    if (description && description.length > 0) {
      def.description = description
        .replace(/\r/g, "")
        .replace(/(?<=[^\n])\n(?=[^\n*-])/g, " ")
        // strip newlines
        .replace(/^\s+|\s+$/g, "");
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
