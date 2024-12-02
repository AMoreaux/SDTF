import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyDurationUnitTypeName } from '../designTokenTypeNames.js';

export const specifyDurationUnitValues = ['ms', 's'] as const;

export const makeSpecifyDurationUnitValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([z.literal('s'), z.literal('ms')]),
);
export type SpecifyDurationUnitValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDurationUnitValueSchema, [false]>
>;
export type SpecifyDurationUnitValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDurationUnitValueSchema, [true]>
>;

export const specifyDurationUnitDefinition = createDesignTokenDefinition({
  type: specifyDurationUnitTypeName,
  aliasableValueZodSchema: makeSpecifyDurationUnitValueSchema(true),
  resolvedValueZodSchema: makeSpecifyDurationUnitValueSchema(false),
});
