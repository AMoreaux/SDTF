import { z } from 'zod';

import { makeSpecifyPositiveIntegerNumberValueSchema } from './_numbers.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyPositiveIntegerNumberTypeName,
  specifyZIndexTypeName,
} from '../designTokenTypeNames.js';

export const makeSpecifyZIndexValueSchema = makeSpecifyPositiveIntegerNumberValueSchema;

export type SpecifyZIndexValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [false]>
>;
export type SpecifyZIndexValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [true]>
>;

export const specifyZIndexDefinition = createDesignTokenDefinition({
  type: specifyZIndexTypeName,
  aliasableValueZodSchema: makeSpecifyZIndexValueSchema(true),
  resolvedValueZodSchema: makeSpecifyZIndexValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyZIndexTypeName },
      { _tokenType: specifyPositiveIntegerNumberTypeName },
    ],
  },
});
