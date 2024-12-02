import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyTextAlignHorizontalTypeName } from '../designTokenTypeNames.js';

export const specifyTextAlignHorizontalValues = [
  'initial',
  'left',
  'right',
  'center',
  'justify',
  'start',
  'end',
  'justify-all',
  'match-parent',
] as const;

export const makeSpecifyTextAlignHorizontalValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([
    z.literal('initial'),
    z.literal('left'),
    z.literal('right'),
    z.literal('center'),
    z.literal('justify'),
    z.literal('start'),
    z.literal('end'),
    z.literal('justify-all'),
    z.literal('match-parent'),
  ]),
);

export type SpecifyTextAlignHorizontalValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextAlignHorizontalValueSchema, [false]>
>;
export type SpecifyTextAlignHorizontalValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextAlignHorizontalValueSchema, [true]>
>;

export const specifyTextAlignHorizontalDefinition = createDesignTokenDefinition({
  type: specifyTextAlignHorizontalTypeName,
  aliasableValueZodSchema: makeSpecifyTextAlignHorizontalValueSchema(true),
  resolvedValueZodSchema: makeSpecifyTextAlignHorizontalValueSchema(false),
});
