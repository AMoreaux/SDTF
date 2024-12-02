import {
  makeSpecifyDimensionValueSchema,
  MakeSpecifyDimensionValueSchemaAliasableReturnType,
  MakeSpecifyDimensionValueSchemaNonAliasableReturnType,
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from './dimension.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifyRadiusTypeName,
} from '../designTokenTypeNames.js';
import { JSONNumberTokenTypesMapping } from './_JSON.js';

export function makeSpecifyRadiusValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyDimensionValueSchemaNonAliasableReturnType;
export function makeSpecifyRadiusValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyDimensionValueSchemaAliasableReturnType;
export function makeSpecifyRadiusValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyDimensionValueSchemaNonAliasableReturnType
  | MakeSpecifyDimensionValueSchemaAliasableReturnType;
export function makeSpecifyRadiusValueSchema(isSupportingAliasing: boolean) {
  return makeSpecifyDimensionValueSchema(isSupportingAliasing);
}

export type SpecifyRadiusValue = SpecifyDimensionValue;
export type SpecifyRadiusValueWithAlias = SpecifyDimensionValueWithAlias;

export const specifyRadiusDefinition = createDesignTokenDefinition({
  type: specifyRadiusTypeName,
  aliasableValueZodSchema: makeSpecifyRadiusValueSchema(true),
  resolvedValueZodSchema: makeSpecifyRadiusValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyRadiusTypeName },
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
