import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyFontStyleTypeName } from '../designTokenTypeNames.js';

export const specifyFontStyleValues = ['normal', 'italic'] as const;

export const makeSpecifyFontStyleValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([z.literal('normal'), z.literal('italic')]),
);

export type SpecifyFontStyleValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontStyleValueSchema, [false]>
>;
export type SpecifyFontStyleValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontStyleValueSchema, [true]>
>;

export const specifyFontStyleDefinition = createDesignTokenDefinition({
  type: specifyFontStyleTypeName,
  aliasableValueZodSchema: makeSpecifyFontStyleValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontStyleValueSchema(false),
});
