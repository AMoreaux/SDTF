import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyTextTransformTypeName } from '../designTokenTypeNames.js';

export const specifyTextTransformValues = [
  'none',
  'capitalize',
  'uppercase',
  'lowercase',
  'full-width',
  'full-size-kana',
  'small-caps',
  'all-small-caps',
] as const;

export const makeSpecifyTextTransformValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([
    z.literal('none'),
    z.literal('capitalize'),
    z.literal('uppercase'),
    z.literal('lowercase'),
    z.literal('full-width'),
    z.literal('full-size-kana'),
    z.literal('small-caps'),
    z.literal('all-small-caps'),
  ]),
);

export type SpecifyTextTransformValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextTransformValueSchema, [false]>
>;
export type SpecifyTextTransformValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextTransformValueSchema, [true]>
>;

export const specifyTextTransformDefinition = createDesignTokenDefinition({
  type: specifyTextTransformTypeName,
  aliasableValueZodSchema: makeSpecifyTextTransformValueSchema(true),
  resolvedValueZodSchema: makeSpecifyTextTransformValueSchema(false),
});
