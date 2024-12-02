import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyBorderStyleValueSchema } from './borderStyle.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyColorValueSchema } from './color.js';
import { makeSpecifyDimensionValueSchema } from './dimension.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyBorderStyleTypeName,
  specifyBorderTypeName,
  specifyColorTypeName,
  specifyDimensionTypeName,
} from '../designTokenTypeNames.js';
import { radiiTokenTypesMapping } from './radii.js';

type MakeSpecifyBorderValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>;
    style: ReturnTypeWithArgs<typeof makeSpecifyBorderStyleValueSchema, [false]>;
    width: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>;
    rectangleCornerRadii: z.ZodUnion<
      [
        z.ZodTuple<
          [
            ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>,
            ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>,
            ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>,
            ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>,
          ]
        >,
        z.ZodNull,
      ]
    >;
  },
  'strict'
>;
type MakeSpecifyBorderValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>;
        style: ReturnTypeWithArgs<typeof makeSpecifyBorderStyleValueSchema, [true]>;
        width: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>;
        rectangleCornerRadii: z.ZodUnion<
          [
            z.ZodTuple<
              [
                ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>,
                ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>,
                ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>,
                ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>,
              ]
            >,
            z.ZodNull,
          ]
        >;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyBorderValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyBorderValueSchemaNonAliasableReturnType;
export function makeSpecifyBorderValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyBorderValueSchemaAliasableReturnType;
export function makeSpecifyBorderValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyBorderValueSchemaNonAliasableReturnType
  | MakeSpecifyBorderValueSchemaAliasableReturnType;

export function makeSpecifyBorderValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        color: makeSpecifyColorValueSchema(isSupportingAliasing),
        style: makeSpecifyBorderStyleValueSchema(isSupportingAliasing),
        width: makeSpecifyDimensionValueSchema(isSupportingAliasing),
        rectangleCornerRadii: z.union([
          z.tuple([
            makeSpecifyDimensionValueSchema(isSupportingAliasing),
            makeSpecifyDimensionValueSchema(isSupportingAliasing),
            makeSpecifyDimensionValueSchema(isSupportingAliasing),
            makeSpecifyDimensionValueSchema(isSupportingAliasing),
          ]),
          z.null(),
        ]),
      })
      .strict(),
  )(isSupportingAliasing);
}
export type SpecifyBorderValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBorderValueSchema, [false]>
>;
export type SpecifyBorderValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBorderValueSchema, [true]>
>;

export const specifyBorderDefinition = createDesignTokenDefinition({
  type: specifyBorderTypeName,
  aliasableValueZodSchema: makeSpecifyBorderValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBorderValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyBorderTypeName },
      {
        _mapOf: {
          color: {
            _tokenType: specifyColorTypeName,
          },
          style: {
            _tokenType: specifyBorderStyleTypeName,
          },
          width: {
            _tokenType: specifyDimensionTypeName,
          },
          rectangleCornerRadii: radiiTokenTypesMapping,
        },
      },
    ],
  },
});
