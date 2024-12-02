import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyTextAlignVerticalTypeName } from '../designTokenTypeNames.js';

export const specifyTextAlignVerticalValues = [
  'initial',
  'baseline',
  'sub',
  'super',
  'text-top',
  'text-bottom',
  'middle',
  'top',
  'bottom',
] as const;

export const makeSpecifyTextAlignVerticalValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([
    z.literal('initial'),
    z.literal('baseline'),
    z.literal('sub'),
    z.literal('super'),
    z.literal('text-top'),
    z.literal('text-bottom'),
    z.literal('middle'),
    z.literal('top'),
    z.literal('bottom'),
  ]),
);
export type SpecifyTextAlignVerticalValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextAlignVerticalValueSchema, [false]>
>;
export type SpecifyTextAlignVerticalValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextAlignVerticalValueSchema, [true]>
>;

export const specifyTextAlignVerticalDefinition = createDesignTokenDefinition({
  type: specifyTextAlignVerticalTypeName,
  aliasableValueZodSchema: makeSpecifyTextAlignVerticalValueSchema(true),
  resolvedValueZodSchema: makeSpecifyTextAlignVerticalValueSchema(false),
});
