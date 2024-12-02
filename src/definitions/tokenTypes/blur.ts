import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyDimensionValueSchema } from './dimension.js';
import {
  specifyBlurTypeName,
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
} from '../designTokenTypeNames.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { JSONNumberTokenTypesMapping } from './_JSON.js';

export const makeSpecifyBlurValueSchema = makeSpecifyDimensionValueSchema;
export type SpecifyBlurValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBlurValueSchema, [false]>
>;
export type SpecifyBlurValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBlurValueSchema, [true]>
>;

export const specifyBlurDefinition = createDesignTokenDefinition({
  type: specifyBlurTypeName,
  aliasableValueZodSchema: makeSpecifyBlurValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBlurValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyBlurTypeName },
      { _tokenType: specifyDimensionTypeName },
      {
        _mapOf: {
          unit: {
            _tokenType: specifyDimensionUnitTypeName,
          },
          value: JSONNumberTokenTypesMapping,
        },
      },
    ],
  },
});
