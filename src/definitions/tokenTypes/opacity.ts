import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyZeroToOneNumberValueSchema } from './_numbers.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyOpacityTypeName, specifyZeroToOneNumberTypeName } from '../designTokenTypeNames.js';

export const makeSpecifyOpacityValueSchema = makeSpecifyZeroToOneNumberValueSchema;

export type SpecifyOpacityValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>
>;
export type SpecifyOpacityValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>
>;

export const specifyOpacityDefinition = createDesignTokenDefinition({
  type: specifyOpacityTypeName,
  aliasableValueZodSchema: makeSpecifyOpacityValueSchema(true),
  resolvedValueZodSchema: makeSpecifyOpacityValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyOpacityTypeName },
      { _tokenType: specifyZeroToOneNumberTypeName },
    ],
  },
});
