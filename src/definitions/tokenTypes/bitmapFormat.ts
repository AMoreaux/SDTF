import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyBitmapFormatTypeName } from '../designTokenTypeNames.js';

export const specifyBitmapFormatValues = ['png', 'wp2', 'avif', 'webp', 'jpg', 'jxl'] as const;

export const specifyBitmapFormatValuesSchema = z.union([
  z.literal('png'),
  z.literal('wp2'),
  z.literal('avif'),
  z.literal('webp'),
  z.literal('jpg'),
  z.literal('jxl'),
]);

export const makeSpecifyBitmapFormatValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  specifyBitmapFormatValuesSchema,
);
export type SpecifyBitmapFormatValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBitmapFormatValueSchema, [false]>
>;
export type SpecifyBitmapFormatValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBitmapFormatValueSchema, [true]>
>;

export const specifyBitmapFormatDefinition = createDesignTokenDefinition({
  type: specifyBitmapFormatTypeName,
  aliasableValueZodSchema: makeSpecifyBitmapFormatValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBitmapFormatValueSchema(false),
});
