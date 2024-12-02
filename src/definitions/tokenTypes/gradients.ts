import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { gradientTokenTypesMapping, makeSpecifyGradientValueSchema } from './gradient.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyGradientsTypeName } from '../designTokenTypeNames.js';

type MakeSpecifyGradientsValueSchemaNonAliasableReturnType = z.ZodArray<
  ReturnTypeWithArgs<typeof makeSpecifyGradientValueSchema, [false]>,
  'atleastone'
>;
type MakeSpecifyGradientsValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyGradientValueSchema, [true]>, 'atleastone'>,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;

export function makeSpecifyGradientsValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyGradientsValueSchemaNonAliasableReturnType;
export function makeSpecifyGradientsValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyGradientsValueSchemaAliasableReturnType;
export function makeSpecifyGradientsValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.array(makeSpecifyGradientValueSchema(isSupportingAliasing)).nonempty(),
  )(isSupportingAliasing);
}

export type SpecifyGradientsValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyGradientsValueSchema, [false]>
>;
export type SpecifyGradientsValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyGradientsValueSchema, [true]>
>;

export const specifyGradientsDefinition = createDesignTokenDefinition({
  type: specifyGradientsTypeName,
  aliasableValueZodSchema: makeSpecifyGradientsValueSchema(true),
  resolvedValueZodSchema: makeSpecifyGradientsValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [{ _tokenType: specifyGradientsTypeName }, { _arrayOf: [gradientTokenTypesMapping] }],
  },
});
