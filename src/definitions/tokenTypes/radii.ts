import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyRadiusValueSchema } from './radius.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { specifyRadiiTypeName, specifyRadiusTypeName } from '../designTokenTypeNames.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';

type MakeSpecifyRadiiValueSchemaNonAliasableReturnType = z.ZodUnion<
  [
    z.ZodTuple<[ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>]>,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [false]>,
      ]
    >,
  ]
>;
type MakeSpecifyRadiiValueSchemaAliasableReturnType = z.ZodUnion<
  [
    SpecifyModeAndValueLevelAliasSignatureSchema,
    z.ZodTuple<[ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>]>,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifyRadiusValueSchema, [true]>,
      ]
    >,
  ]
>;

export function makeSpecifyRadiiValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyRadiiValueSchemaNonAliasableReturnType;
// @ts-expect-error - modeLevelAliasing detection issue
export function makeSpecifyRadiiValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyRadiiValueSchemaAliasableReturnType;
export function makeSpecifyRadiiValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyRadiiValueSchemaNonAliasableReturnType
  | MakeSpecifyRadiiValueSchemaAliasableReturnType;
export function makeSpecifyRadiiValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    // We make the implementation more performant by using a single z.array instead of z.union of z.tuple
    z
      .array(makeSpecifyRadiusValueSchema(isSupportingAliasing), {
        required_error: 'Specify radii must be an array containing 1 to 4 spacing value(s)',
        invalid_type_error: 'Specify radii must be an array containing 1 to 4 spacing value(s)',
      })
      .min(1, { message: 'Specify radii must have at least 1 radius value(s)' })
      .max(4, { message: 'Specify radii must have at most 4 radius values' }),
    // z.union([
    //     z.tuple([
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //     ]),
    //     z.tuple([
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //     ]),
    //     z.tuple([
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //     ]),
    //     z.tuple([
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //         makeSpecifyRadiusValueSchema(isSupportingAliasing),
    //     ]),
    // ])
  )(isSupportingAliasing);
}

export type SpecifyRadiiValue = z.infer<MakeSpecifyRadiiValueSchemaNonAliasableReturnType>;
export type SpecifyRadiiValueWithAlias = z.infer<MakeSpecifyRadiiValueSchemaAliasableReturnType>;

export const radiiTokenTypesMapping: TokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyRadiiTypeName },
    { _tuple: [{ _tokenType: specifyRadiusTypeName }] },
    { _tuple: [{ _tokenType: specifyRadiusTypeName }, { _tokenType: specifyRadiusTypeName }] },
    {
      _tuple: [
        { _tokenType: specifyRadiusTypeName },
        { _tokenType: specifyRadiusTypeName },
        { _tokenType: specifyRadiusTypeName },
      ],
    },
    {
      _tuple: [
        { _tokenType: specifyRadiusTypeName },
        { _tokenType: specifyRadiusTypeName },
        { _tokenType: specifyRadiusTypeName },
        { _tokenType: specifyRadiusTypeName },
      ],
    },
  ],
};

export const specifyRadiiDefinition = createDesignTokenDefinition({
  type: specifyRadiiTypeName,
  aliasableValueZodSchema: makeSpecifyRadiiValueSchema(true),
  resolvedValueZodSchema: makeSpecifyRadiiValueSchema(false),
  tokenTypesMapping: radiiTokenTypesMapping,
});
