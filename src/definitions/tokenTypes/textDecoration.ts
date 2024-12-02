import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyTextDecorationTypeName } from '../designTokenTypeNames.js';

export const specifyTextDecorationValues = [
  'none',
  'underline',
  'overline',
  'line-through',
  'dashed',
  'wavy',
] as const;

export const makeSpecifyTextDecorationValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([
    z.literal('none'),
    z.literal('underline'),
    z.literal('overline'),
    z.literal('line-through'),
    z.literal('dashed'),
    z.literal('wavy'),
  ]),
);

export type SpecifyTextDecorationValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextDecorationValueSchema, [false]>
>;
export type SpecifyTextDecorationValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextDecorationValueSchema, [true]>
>;

export const specifyTextDecorationDefinition = createDesignTokenDefinition({
  type: specifyTextDecorationTypeName,
  aliasableValueZodSchema: makeSpecifyTextDecorationValueSchema(true),
  resolvedValueZodSchema: makeSpecifyTextDecorationValueSchema(false),
});
