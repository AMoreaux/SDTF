import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyFontFeatureTypeName } from '../designTokenTypeNames.js';

export const specifyFontFeatureValues = [
  'normal',
  'none',
  'small-caps',
  'all-small-caps',
  'petite-caps',
  'all-petite-caps',
  'unicase',
  'titling-caps',
  'common-ligatures',
  'no-common-ligatures',
  'discretionary-ligatures',
  'no-discretionary-ligatures',
  'historical-ligatures',
  'no-historical-ligatures',
  'contextual',
  'no-contextual',
  'ordinal',
  'slashed-zero',
  'lining-nums',
  'proportional-nums',
  'tabular-nums',
  'diagonal-fractions',
  'stacked-fractions',
  'oldstyle-nums',
] as const;

export const makeSpecifyFontFeatureValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([
    z.literal('normal'),
    z.literal('none'),
    z.literal('small-caps'),
    z.literal('all-small-caps'),
    z.literal('petite-caps'),
    z.literal('all-petite-caps'),
    z.literal('unicase'),
    z.literal('titling-caps'),
    z.literal('common-ligatures'),
    z.literal('no-common-ligatures'),
    z.literal('discretionary-ligatures'),
    z.literal('no-discretionary-ligatures'),
    z.literal('historical-ligatures'),
    z.literal('no-historical-ligatures'),
    z.literal('contextual'),
    z.literal('no-contextual'),
    z.literal('ordinal'),
    z.literal('slashed-zero'),
    z.literal('lining-nums'),
    z.literal('proportional-nums'),
    z.literal('tabular-nums'),
    z.literal('diagonal-fractions'),
    z.literal('stacked-fractions'),
    z.literal('oldstyle-nums'),
  ]),
);
export type SpecifyFontFeatureValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontFeatureValueSchema, [false]>
>;
export type SpecifyFontFeatureValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontFeatureValueSchema, [true]>
>;

export const specifyFontFeatureDefinition = createDesignTokenDefinition({
  type: specifyFontFeatureTypeName,
  aliasableValueZodSchema: makeSpecifyFontFeatureValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontFeatureValueSchema(false),
});
