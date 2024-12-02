import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyVectorFormatTypeName } from '../designTokenTypeNames.js';

export const specifyVectorFormatValues = ['svg', 'pdf'] as const;

export const specifyVectorFormatSchema = z.union([z.literal('svg'), z.literal('pdf')]);

export const makeSpecifyVectorFormatValueSchema =
  makeUnionWithModeAndValueLevelAliasValue(specifyVectorFormatSchema);
export type SpecifyVectorFormatValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyVectorFormatValueSchema, [false]>
>;
export type SpecifyVectorFormatValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyVectorFormatValueSchema, [true]>
>;

export const specifyVectorFormatDefinition = createDesignTokenDefinition({
  type: specifyVectorFormatTypeName,
  aliasableValueZodSchema: makeSpecifyVectorFormatValueSchema(true),
  resolvedValueZodSchema: makeSpecifyVectorFormatValueSchema(false),
});
