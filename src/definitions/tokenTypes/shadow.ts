import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { colorTokenTypesMapping, makeSpecifyColorValueSchema } from './color.js';
import { makeSpecifyDimensionValueSchema } from './dimension.js';
import { makeSpecifyShadowTypeValueSchema } from './shadowType.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyBlurTypeName,
  specifyDimensionTypeName,
  specifyRadiusTypeName,
  specifyShadowTypeName,
  specifyShadowTypeTypeName,
} from '../designTokenTypeNames.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';

type MakeSpecifyShadowValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>;
    offsetX: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>;
    offsetY: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>;
    blurRadius: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>;
    spreadRadius: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>;
    type: ReturnTypeWithArgs<typeof makeSpecifyShadowTypeValueSchema, [false]>;
  },
  'strict'
>;
type MakeSpecifyShadowValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>;
        offsetX: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>;
        offsetY: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>;
        blurRadius: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>;
        spreadRadius: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>;
        type: ReturnTypeWithArgs<typeof makeSpecifyShadowTypeValueSchema, [true]>;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;

export function makeSpecifyShadowValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyShadowValueSchemaNonAliasableReturnType;
export function makeSpecifyShadowValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyShadowValueSchemaAliasableReturnType;
export function makeSpecifyShadowValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyShadowValueSchemaNonAliasableReturnType
  | MakeSpecifyShadowValueSchemaAliasableReturnType;
export function makeSpecifyShadowValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        color: makeSpecifyColorValueSchema(isSupportingAliasing),
        offsetX: makeSpecifyDimensionValueSchema(isSupportingAliasing),
        offsetY: makeSpecifyDimensionValueSchema(isSupportingAliasing),
        blurRadius: makeSpecifyDimensionValueSchema(isSupportingAliasing),
        spreadRadius: makeSpecifyDimensionValueSchema(isSupportingAliasing),
        type: makeSpecifyShadowTypeValueSchema(isSupportingAliasing),
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyShadowValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyShadowValueSchema, [false]>
>;
export type SpecifyShadowValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyShadowValueSchema, [true]>
>;

export const shadowTokenTypesMapping: TokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyShadowTypeName },
    {
      _mapOf: {
        color: colorTokenTypesMapping,
        offsetX: { _tokenType: specifyDimensionTypeName },
        offsetY: { _tokenType: specifyDimensionTypeName },
        blurRadius: {
          _unionOf: [
            { _tokenType: specifyBlurTypeName },
            { _tokenType: specifyRadiusTypeName },
            { _tokenType: specifyDimensionTypeName },
          ],
        },
        spreadRadius: {
          _unionOf: [
            { _tokenType: specifyBlurTypeName },
            { _tokenType: specifyRadiusTypeName },
            { _tokenType: specifyDimensionTypeName },
          ],
        },
        type: { _tokenType: specifyShadowTypeTypeName },
      },
    },
  ],
};

export const specifyShadowDefinition = createDesignTokenDefinition({
  type: specifyShadowTypeName,
  aliasableValueZodSchema: makeSpecifyShadowValueSchema(true),
  resolvedValueZodSchema: makeSpecifyShadowValueSchema(false),
  tokenTypesMapping: shadowTokenTypesMapping,
});
