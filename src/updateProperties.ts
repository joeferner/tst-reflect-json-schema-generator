import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import NestedError from "nested-error-stacks";
import { AccessModifier, Accessor, Property, Type } from "tst-reflect";
import ts from "typescript";
import { Options, resolveType } from ".";
import { createDefinitionForType } from "./createDefinitionForType";
import { updateWithJsDocs } from "./updateWithJsDocs";
import { findJsDocTags } from "./utils";

export function updateProperties(
  parentType: Type,
  def: JSONSchema7,
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): void {
  const containerType = parentType;

  const isPartial = parentType.fullName === "Partial";
  if (isPartial) {
    const genericArguments = parentType.getTypeArguments();
    const ga = genericArguments?.[0];
    if (genericArguments?.length !== 1 || ga === undefined) {
      throw new Error("invalid Partial, expected 1 generic argument");
    }
    parentType = ga;
  }

  genericTypes = { ...genericTypes, ...getGenericTypeMap(parentType) };

  const typeProperties = [...parentType.getProperties()].sort(
    comparePropertyNames
  );
  for (const property of typeProperties) {
    try {
      if (property.accessModifier !== AccessModifier.Public) {
        continue;
      }

      if (property.accessor === Accessor.Getter) {
        continue;
      }

      if (def.properties![property.name]) {
        continue;
      }

      if (!property.type) {
        throw new Error(`missing type for property: ${property.name}`);
      }

      if (property.name === ts.InternalSymbolName.Index) {
        def.additionalProperties = createDefinitionForTypes(
          property.type.types,
          definitions,
          genericTypes,
          options
        );
        continue;
      }

      const propertyType = resolveType(property.type, genericTypes);
      const refTags = findJsDocTags(property.jsDocs, "ref");
      let p: JSONSchema7;
      if (refTags && refTags[0]) {
        p = {
          $ref: refTags[0].comment,
        };
      } else {
        p = createDefinitionForType(
          propertyType,
          definitions,
          genericTypes,
          options
        );
      }
      updateWithJsDocs(containerType, property, p, options);

      def.properties![property.name] = p;

      if (!property.optional) {
        def.required!.push(property.name);
      }
    } catch (err) {
      throw new NestedError(
        `failed on property "${property.name}"`,
        err as Error
      );
    }
  }
}

function createDefinitionForTypes(
  types: readonly Type[],
  definitions: Record<string, JSONSchema7Definition>,
  genericTypes: Record<string, Type>,
  options: Options
): JSONSchema7 {
  const typesDefinitions = types.map((t) =>
    createDefinitionForType(t, definitions, genericTypes, options)
  );

  const isSimpleType = (
    t: JSONSchema7
  ): t is {
    type: JSONSchema7TypeName | JSONSchema7TypeName[];
  } => {
    return Object.keys(t).length === 1 && !!t.type;
  };

  if (typesDefinitions.every(isSimpleType)) {
    return { type: typesDefinitions.flatMap((t) => t.type) };
  }
  throw new Error("unhandled, multiple complex types");
}

function comparePropertyNames(a: Property, b: Property): number {
  return a.name > b.name ? 1 : -1;
}

function getGenericTypeMap(type: Type): Record<string, Type> {
  const typeArguments = type.getTypeArguments();
  const typeParameters = type.getTypeParameters();
  if (!typeArguments || !typeParameters) {
    return {};
  }
  const results: Record<string, Type> = {};
  for (let i = 0; i < typeArguments.length; i++) {
    const typeArgument = typeArguments[i];
    const typeParameter = typeParameters[i];
    if (!typeArgument || !typeParameter) {
      continue;
    }
    results[typeParameter.name] = typeArgument;
  }
  return results;
}
