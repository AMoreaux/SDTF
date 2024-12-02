import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { JSONNumberTokenTypesMapping, makeSpecifyJSONNumberValueSchema } from './_JSON.js';
import { makeSpecifyDimensionUnitValueSchema } from './dimensionUnit.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyDimensionTypeName, specifyDimensionUnitTypeName } from '../designTokenTypeNames.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';

export type MakeSpecifyDimensionValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    value: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [false]>;
    unit: ReturnTypeWithArgs<typeof makeSpecifyDimensionUnitValueSchema, [false]>;
  },
  'strict'
>;
export type MakeSpecifyDimensionValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        value: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [true]>;
        unit: ReturnTypeWithArgs<typeof makeSpecifyDimensionUnitValueSchema, [true]>;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyDimensionValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyDimensionValueSchemaNonAliasableReturnType;
export function makeSpecifyDimensionValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyDimensionValueSchemaAliasableReturnType;
export function makeSpecifyDimensionValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyDimensionValueSchemaNonAliasableReturnType
  | MakeSpecifyDimensionValueSchemaAliasableReturnType;
export function makeSpecifyDimensionValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        value: makeSpecifyJSONNumberValueSchema(isSupportingAliasing),
        unit: makeSpecifyDimensionUnitValueSchema(isSupportingAliasing),
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyDimensionValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>
>;
export type SpecifyDimensionValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>
>;

export const specifyDimensionTokenTypesMapping = {
  _unionOf: [
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

export const specifyDimensionDefinition = createDesignTokenDefinition({
  type: specifyDimensionTypeName,
  aliasableValueZodSchema: makeSpecifyDimensionValueSchema(true),
  resolvedValueZodSchema: makeSpecifyDimensionValueSchema(false),
  tokenTypesMapping: specifyDimensionTokenTypesMapping,
});
