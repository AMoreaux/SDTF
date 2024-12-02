import { z } from 'zod';

import {
  SpecifyModeAndValueLevelAliasSignature,
  SpecifyModeAndValueLevelAliasSignatureSchema,
  specifyModeAndValueLevelAliasSignatureSchema,
  WithModeAndValueLevelAlias,
} from '../internals/designTokenAlias.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyHexadecimalColorStringTypeName,
  specifyArcDegreeNumberTypeName,
  specifyIntegerNumberTypeName,
  specifyPercentageNumberTypeName,
  specifyPositiveIntegerNumberTypeName,
  specifyPositiveNumberTypeName,
  specifyRGBColorNumberTypeName,
  specifyZeroToOneNumberTypeName,
  specifyJSONStringTypeName,
  specifyJSONArrayTypeName,
  specifyJSONBooleanTypeName,
  specifyJSONNullTypeName,
  specifyJSONNumberTypeName,
  specifyJSONObjectTypeName,
} from '../designTokenTypeNames.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';

/* ==========================================
   JSON Value Types
============================================= */
export const makeSpecifyJSONStringValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.string(),
);
export type SpecifyJSONStringValue = string;
export type SpecifyJSONStringValueWithAlias = WithModeAndValueLevelAlias<SpecifyJSONStringValue>;
export const specifyJSONStringDefinition = createDesignTokenDefinition({
  type: specifyJSONStringTypeName,
  aliasableValueZodSchema: makeSpecifyJSONStringValueSchema(true),
  resolvedValueZodSchema: makeSpecifyJSONStringValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyJSONStringTypeName },
      { _tokenType: specifyHexadecimalColorStringTypeName },
    ],
  },
});

export const makeSpecifyJSONNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number(),
);
export type SpecifyJSONNumberValue = number;
export type SpecifyJSONNumberValueWithAlias = WithModeAndValueLevelAlias<SpecifyJSONNumberValue>;
export const JSONNumberTokenTypesMapping: TokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyJSONNumberTypeName },
    { _tokenType: specifyArcDegreeNumberTypeName },
    { _tokenType: specifyIntegerNumberTypeName },
    { _tokenType: specifyPercentageNumberTypeName },
    { _tokenType: specifyPositiveIntegerNumberTypeName },
    { _tokenType: specifyPositiveNumberTypeName },
    { _tokenType: specifyRGBColorNumberTypeName },
    { _tokenType: specifyZeroToOneNumberTypeName },
  ],
};
export const specifyJSONNumberDefinition = createDesignTokenDefinition({
  type: specifyJSONNumberTypeName,
  aliasableValueZodSchema: makeSpecifyJSONNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyJSONNumberValueSchema(false),
  tokenTypesMapping: JSONNumberTokenTypesMapping,
});

export const makeSpecifyJSONBooleanValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.boolean(),
);
export type SpecifyJSONBooleanValue = boolean;
export type SpecifyJSONBooleanValueWithAlias = WithModeAndValueLevelAlias<SpecifyJSONBooleanValue>;
export const specifyJSONBooleanDefinition = createDesignTokenDefinition({
  type: specifyJSONBooleanTypeName,
  aliasableValueZodSchema: makeSpecifyJSONBooleanValueSchema(true),
  resolvedValueZodSchema: makeSpecifyJSONBooleanValueSchema(false),
});

export const makeSpecifyJSONNullValueSchema = makeUnionWithModeAndValueLevelAliasValue(z.null());
export type SpecifyJSONNullValue = null;
export type SpecifyJSONNullValueWithAlias = WithModeAndValueLevelAlias<SpecifyJSONNullValue>;
export const specifyJSONNullDefinition = createDesignTokenDefinition({
  type: specifyJSONNullTypeName,
  aliasableValueZodSchema: makeSpecifyJSONNullValueSchema(true),
  resolvedValueZodSchema: makeSpecifyJSONNullValueSchema(false),
});

// The JSONLiteralValue schema definition MUST NOT be used in functional SDTF code.
// It is defined to be a primitive definition of this very module.
const makeJSONLiteralValueSchema = (isSupportingAliasing: boolean) => {
  return z.union([
    makeSpecifyJSONStringValueSchema(isSupportingAliasing),
    makeSpecifyJSONNumberValueSchema(isSupportingAliasing),
    makeSpecifyJSONBooleanValueSchema(isSupportingAliasing),
    makeSpecifyJSONNullValueSchema(isSupportingAliasing),
  ]);
};
type JSONLiteralValue = z.infer<ReturnType<typeof makeJSONLiteralValueSchema>>;
// JSONLiteralValue is not aliasable since never implemented in SDTF

// The JSONValue schema definition MUST NOT be used in functional SDTF code.
// It is defined to be a primitive definition of this very module. Export is test only.
export const makeJSONValueSchema = (isSupportingAliasing: boolean): z.ZodType<SpecifyJSONValue> =>
  z.lazy(() =>
    z.union([
      makeJSONLiteralValueSchema(isSupportingAliasing),
      z.array(makeJSONValueSchema(isSupportingAliasing)),
      z.record(makeJSONValueSchema(isSupportingAliasing)),
    ]),
  );
export type SpecifyJSONValue =
  | JSONLiteralValue
  | { [name: string]: SpecifyJSONValue }
  | SpecifyJSONValue[];
// JSONValue is not aliasable since never implemented in SDTF

// JSON Array
export function makeSpecifyJSONArrayValueSchema(
  isSupportingAliasing: true,
): z.ZodUnion<
  [
    z.ZodArray<
      z.ZodUnion<[z.ZodType<SpecifyJSONValue>, SpecifyModeAndValueLevelAliasSignatureSchema]>
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyJSONArrayValueSchema(
  isSupportingAliasing: false,
): z.ZodArray<z.ZodType<SpecifyJSONValue>>;
export function makeSpecifyJSONArrayValueSchema(isSupportingAliasing: boolean) {
  if (isSupportingAliasing) {
    return z.union([
      z.array(makeJSONValueSchema(isSupportingAliasing)),
      specifyModeAndValueLevelAliasSignatureSchema,
    ]);
  }
  return z.array(makeJSONValueSchema(isSupportingAliasing));
}
export type SpecifyJSONArrayValue = Array<SpecifyJSONValue>;
export type SpecifyJSONArrayValueWithAlias = WithModeAndValueLevelAlias<
  Array<SpecifyJSONValue | SpecifyModeAndValueLevelAliasSignature>
>;
export const specifyJSONArrayDefinition = createDesignTokenDefinition({
  type: specifyJSONArrayTypeName,
  aliasableValueZodSchema: makeSpecifyJSONArrayValueSchema(true),
  resolvedValueZodSchema: makeSpecifyJSONArrayValueSchema(false),
});

// JSON Object
export function makeSpecifyJSONObjectValueSchema(
  isSupportingAliasing: true,
): z.ZodUnion<
  [
    z.ZodRecord<
      z.ZodType<string>,
      z.ZodUnion<[z.ZodType<SpecifyJSONValue>, SpecifyModeAndValueLevelAliasSignatureSchema]>
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyJSONObjectValueSchema(
  isSupportingAliasing: false,
): z.ZodRecord<z.ZodType<string>, z.ZodType<SpecifyJSONValue>>;
export function makeSpecifyJSONObjectValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.record(makeJSONValueSchema(isSupportingAliasing)),
  )(isSupportingAliasing);
}
export type SpecifyJSONObjectValue = { [key: string]: SpecifyJSONValue };
export type SpecifyJSONObjectValueWithAlias = WithModeAndValueLevelAlias<{
  [key: string]: SpecifyJSONValue | SpecifyModeAndValueLevelAliasSignature;
}>;
export const specifyJSONObjectDefinition = createDesignTokenDefinition({
  type: specifyJSONObjectTypeName,
  aliasableValueZodSchema: makeSpecifyJSONObjectValueSchema(true),
  resolvedValueZodSchema: makeSpecifyJSONObjectValueSchema(false),
});
