import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyCubicBezierTypeName } from '../designTokenTypeNames.js';

export const makeSpecifyCubicBezierValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.tuple([z.number().min(0).max(1), z.number(), z.number().min(0).max(1), z.number()]),
);
export type SpecifyCubicBezierValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyCubicBezierValueSchema, [false]>
>;
export type SpecifyCubicBezierValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyCubicBezierValueSchema, [true]>
>;

export const specifyCubicBezierDefinition = createDesignTokenDefinition({
  type: specifyCubicBezierTypeName,
  aliasableValueZodSchema: makeSpecifyCubicBezierValueSchema(true),
  resolvedValueZodSchema: makeSpecifyCubicBezierValueSchema(false),
});
