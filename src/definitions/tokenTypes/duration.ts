import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { makeSpecifyJSONNumberValueSchema } from './_JSON.js';
import { makeSpecifyDurationUnitValueSchema } from './durationUnit.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyPositiveNumberValueSchema } from './_numbers.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyDurationTypeName,
  specifyDurationUnitTypeName,
  specifyPositiveNumberTypeName,
} from '../designTokenTypeNames.js';

type MakeSpecifyDurationValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    value: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [false]>;
    unit: ReturnTypeWithArgs<typeof makeSpecifyDurationUnitValueSchema, [false]>;
  },
  'strict'
>;
type MakeSpecifyDurationValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        value: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [true]>;
        unit: ReturnTypeWithArgs<typeof makeSpecifyDurationUnitValueSchema, [true]>;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyDurationValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyDurationValueSchemaNonAliasableReturnType;
export function makeSpecifyDurationValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyDurationValueSchemaAliasableReturnType;
export function makeSpecifyDurationValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyDurationValueSchemaNonAliasableReturnType
  | MakeSpecifyDurationValueSchemaAliasableReturnType;
export function makeSpecifyDurationValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        value: makeSpecifyPositiveNumberValueSchema(isSupportingAliasing),
        unit: makeSpecifyDurationUnitValueSchema(isSupportingAliasing),
      })
      .strict(),
  )(isSupportingAliasing);
}
export type SpecifyDurationValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDurationValueSchema, [false]>
>;
export type SpecifyDurationValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDurationValueSchema, [true]>
>;

export const specifyDurationDefinition = createDesignTokenDefinition({
  type: specifyDurationTypeName,
  aliasableValueZodSchema: makeSpecifyDurationValueSchema(true),
  resolvedValueZodSchema: makeSpecifyDurationValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyDurationTypeName },
      {
        _mapOf: {
          value: {
            _tokenType: specifyPositiveNumberTypeName,
          },
          unit: {
            _tokenType: specifyDurationUnitTypeName,
          },
        },
      },
    ],
  },
});
