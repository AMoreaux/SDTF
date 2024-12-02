import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyBorderStyleLineCapTypeName } from '../designTokenTypeNames.js';

export const specifyBorderStyleLineCapValues = ['butt', 'round', 'square'] as const;

export const makeSpecifyBorderStyleLineCapValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([z.literal('butt'), z.literal('round'), z.literal('square')]),
);
export type SpecifyBorderStyleLineCapValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBorderStyleLineCapValueSchema, [false]>
>;
export type SpecifyBorderStyleLineCapValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBorderStyleLineCapValueSchema, [true]>
>;

export const specifyBorderStyleLineCapDefinition = createDesignTokenDefinition({
  type: specifyBorderStyleLineCapTypeName,
  aliasableValueZodSchema: makeSpecifyBorderStyleLineCapValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBorderStyleLineCapValueSchema(false),
});
