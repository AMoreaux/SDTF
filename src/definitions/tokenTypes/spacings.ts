import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';

import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifySpacingsTypeName, specifySpacingTypeName } from '../designTokenTypeNames.js';
import { makeSpecifySpacingValueSchema } from './spacing.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';

type MakeSpecifySpacingsValueSchemaNonAliasableReturnType = z.ZodUnion<
  [
    z.ZodTuple<[ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>]>,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [false]>,
      ]
    >,
  ]
>;
type MakeSpecifySpacingsValueSchemaAliasableReturnType = z.ZodUnion<
  [
    SpecifyModeAndValueLevelAliasSignatureSchema,
    z.ZodTuple<[ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>]>,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
      ]
    >,
    z.ZodTuple<
      [
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
        ReturnTypeWithArgs<typeof makeSpecifySpacingValueSchema, [true]>,
      ]
    >,
  ]
>;

export function makeSpecifySpacingsValueSchema(
  isSupportingAliasing: false,
): MakeSpecifySpacingsValueSchemaNonAliasableReturnType;
// @ts-expect-error - modeLevelAliasing detection issue
export function makeSpecifySpacingsValueSchema(
  isSupportingAliasing: true,
): MakeSpecifySpacingsValueSchemaAliasableReturnType;
export function makeSpecifySpacingsValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifySpacingsValueSchemaNonAliasableReturnType
  | MakeSpecifySpacingsValueSchemaAliasableReturnType;
export function makeSpecifySpacingsValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    // We make the implementation more performant by using a single z.array instead of z.union of z.tuple
    z
      .array(makeSpecifySpacingValueSchema(isSupportingAliasing), {
        required_error: 'Specify spacings must be an array containing 1 to 4 spacing value(s)',
        invalid_type_error: 'Specify radii must be an array containing 1 to 4 spacing value(s)',
      })
      .min(1, { message: 'Specify spacings must have at least 1 spacing value(s)' })
      .max(4, { message: 'Specify spacings must have at most 4 spacing values' }),
    // z.union([
    //     z.tuple([
    //         makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     ]),
    //   z.tuple([
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //   ]),
    //   z.tuple([
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //   ]),
    //   z.tuple([
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //     makeSpecifySpacingValueSchema(isSupportingAliasing),
    //   ]),
    // ]),
  )(isSupportingAliasing);
}

export type SpecifySpacingsValue = z.infer<MakeSpecifySpacingsValueSchemaNonAliasableReturnType>;

export type SpecifySpacingsValueWithAlias =
  z.infer<MakeSpecifySpacingsValueSchemaAliasableReturnType>;

export const specifySpacingsDefinition = createDesignTokenDefinition({
  type: specifySpacingsTypeName,
  aliasableValueZodSchema: makeSpecifySpacingsValueSchema(true),
  resolvedValueZodSchema: makeSpecifySpacingsValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifySpacingsTypeName },
      {
        _tuple: [{ _tokenType: specifySpacingTypeName }],
      },
      {
        _tuple: [{ _tokenType: specifySpacingTypeName }, { _tokenType: specifySpacingTypeName }],
      },
      {
        _tuple: [
          { _tokenType: specifySpacingTypeName },
          { _tokenType: specifySpacingTypeName },
          { _tokenType: specifySpacingTypeName },
        ],
      },
      {
        _tuple: [
          { _tokenType: specifySpacingTypeName },
          { _tokenType: specifySpacingTypeName },
          { _tokenType: specifySpacingTypeName },
          { _tokenType: specifySpacingTypeName },
        ],
      },
    ],
  },
});
