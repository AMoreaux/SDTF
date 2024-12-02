import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyFontWeightTypeName } from '../designTokenTypeNames.js';

export const specifyNamedFontWeightValues = [
  'thin',
  'hairline',
  'extra-light',
  'ultra-light',
  'light',
  'normal',
  'plain',
  'standard',
  'regular',
  'roman',
  'book',
  'medium',
  'semi-bold',
  'demi-bold',
  'bold',
  'heavy',
  'black',
  'extra-bold',
  'extra-black',
  'ultra-bold',
  'ultra-black',
] as const;

const specifyFontWeightNomenclatureSchema = z.union([
  z.literal('thin'),
  z.literal('hairline'),
  z.literal('extra-light'),
  z.literal('ultra-light'),
  z.literal('light'),
  z.literal('normal'),
  z.literal('plain'),
  z.literal('standard'),
  z.literal('regular'),
  z.literal('roman'),
  z.literal('book'),
  z.literal('medium'),
  z.literal('semi-bold'),
  z.literal('demi-bold'),
  z.literal('bold'),
  z.literal('extra-bold'),
  z.literal('ultra-bold'),
  z.literal('black'),
  z.literal('heavy'),
  z.literal('extra-black'),
  z.literal('ultra-black'),
]);
export const makeSpecifyFontWeightValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([z.number().min(1).max(1000), specifyFontWeightNomenclatureSchema]),
);
export type SpecifyFontWeightValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontWeightValueSchema, [false]>
>;
export type SpecifyFontWeightValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontWeightValueSchema, [true]>
>;

export const specifyFontWeightDefinition = createDesignTokenDefinition({
  type: specifyFontWeightTypeName,
  aliasableValueZodSchema: makeSpecifyFontWeightValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontWeightValueSchema(false),
});
