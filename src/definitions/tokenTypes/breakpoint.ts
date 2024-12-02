import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyDimensionValueSchema } from './dimension.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyBreakpointTypeName,
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifyJSONNumberTypeName,
} from '../designTokenTypeNames.js';

export const makeSpecifyBreakpointValueSchema = makeSpecifyDimensionValueSchema;
export type SpecifyBreakpointValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBreakpointValueSchema, [false]>
>;
export type SpecifyBreakpointValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBreakpointValueSchema, [true]>
>;

export const specifyBreakpointDefinition = createDesignTokenDefinition({
  type: specifyBreakpointTypeName,
  aliasableValueZodSchema: makeSpecifyBreakpointValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBreakpointValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyBreakpointTypeName },
      { _tokenType: specifyDimensionTypeName },
      {
        _mapOf: {
          unit: {
            _tokenType: specifyDimensionUnitTypeName,
          },
          value: {
            _tokenType: specifyJSONNumberTypeName,
          },
        },
      },
    ],
  },
});
