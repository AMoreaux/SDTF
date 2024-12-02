import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyShadowTypeTypeName } from '../designTokenTypeNames.js';

export const specifyShadowTypeTypeValues = ['inner', 'outer'] as const;

export const makeSpecifyShadowTypeValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([z.literal('inner'), z.literal('outer')]),
);

export type SpecifyShadowTypeValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyShadowTypeValueSchema, [false]>
>;
export type SpecifyShadowTypeValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyShadowTypeValueSchema, [true]>
>;

export const specifyShadowTypeDefinition = createDesignTokenDefinition({
  type: specifyShadowTypeTypeName,
  aliasableValueZodSchema: makeSpecifyShadowTypeValueSchema(true),
  resolvedValueZodSchema: makeSpecifyShadowTypeValueSchema(false),
});
