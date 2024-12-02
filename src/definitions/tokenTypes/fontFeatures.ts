import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyFontFeatureValueSchema } from './fontFeature.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyFontFeaturesTypeName,
  specifyFontFeatureTypeName,
} from '../designTokenTypeNames.js';

type MakeSpecifyFontFeaturesValueSchemaNonAliasableReturnType = z.ZodArray<
  ReturnTypeWithArgs<typeof makeSpecifyFontFeatureValueSchema, [false]>,
  'atleastone'
>;
type MakeSpecifyFontFeaturesValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyFontFeatureValueSchema, [true]>, 'atleastone'>,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyFontFeaturesValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyFontFeaturesValueSchemaNonAliasableReturnType;
export function makeSpecifyFontFeaturesValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyFontFeaturesValueSchemaAliasableReturnType;
export function makeSpecifyFontFeaturesValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyFontFeaturesValueSchemaNonAliasableReturnType
  | MakeSpecifyFontFeaturesValueSchemaAliasableReturnType;
export function makeSpecifyFontFeaturesValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.array(makeSpecifyFontFeatureValueSchema(isSupportingAliasing)).nonempty(),
  )(isSupportingAliasing);
}

export type SpecifyFontFeaturesValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontFeaturesValueSchema, [false]>
>;
export type SpecifyFontFeaturesValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontFeaturesValueSchema, [true]>
>;

export const specifyFontFeaturesDefinition = createDesignTokenDefinition({
  type: specifyFontFeaturesTypeName,
  aliasableValueZodSchema: makeSpecifyFontFeaturesValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontFeaturesValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyFontFeaturesTypeName },
      { _arrayOf: [{ _tokenType: specifyFontFeatureTypeName }] },
    ],
  },
});
