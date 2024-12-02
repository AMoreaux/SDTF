import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyFontFormatTypeName } from '../designTokenTypeNames.js';

export const specifyFontFormatValues = ['ttf', 'woff', 'woff2', 'otf', 'eot'] as const;

export const specifyFontFormatSchema = z.union([
  z.literal('ttf'),
  z.literal('woff'),
  z.literal('woff2'),
  z.literal('otf'),
  z.literal('eot'),
]);

export const makeSpecifyFontFormatValueSchema =
  makeUnionWithModeAndValueLevelAliasValue(specifyFontFormatSchema);
export type SpecifyFontFormatValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontFormatValueSchema, [false]>
>;
export type SpecifyFontFormatValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontFormatValueSchema, [true]>
>;

export const specifyFontFormatDefinition = createDesignTokenDefinition({
  type: specifyFontFormatTypeName,
  aliasableValueZodSchema: makeSpecifyFontFormatValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontFormatValueSchema(false),
});
