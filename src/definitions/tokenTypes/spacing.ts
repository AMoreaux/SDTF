import {
  makeSpecifyDimensionValueSchema,
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from './dimension.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifySpacingTypeName,
} from '../designTokenTypeNames.js';
import { JSONNumberTokenTypesMapping } from './_JSON.js';

export const makeSpecifySpacingValueSchema = makeSpecifyDimensionValueSchema;

export type SpecifySpacingValue = SpecifyDimensionValue; // not using z.infer for performance optimization
export type SpecifySpacingValueWithAlias = SpecifyDimensionValueWithAlias; // not using z.infer for performance optimization

export const specifySpacingTokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifySpacingTypeName },
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
};

export const specifySpacingDefinition = createDesignTokenDefinition({
  type: specifySpacingTypeName,
  aliasableValueZodSchema: makeSpecifySpacingValueSchema(true),
  resolvedValueZodSchema: makeSpecifySpacingValueSchema(false),
  tokenTypesMapping: specifySpacingTokenTypesMapping,
});
