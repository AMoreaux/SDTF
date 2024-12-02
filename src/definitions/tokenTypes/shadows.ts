import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyShadowValueSchema, shadowTokenTypesMapping } from './shadow.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyShadowsTypeName, specifyShadowTypeName } from '../designTokenTypeNames.js';

type MakeSpecifyShadowsValueSchemaNonAliasableReturnType = z.ZodArray<
  ReturnTypeWithArgs<typeof makeSpecifyShadowValueSchema, [false]>,
  'atleastone'
>;
type MakeSpecifyShadowsValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyShadowValueSchema, [true]>, 'atleastone'>,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyShadowsValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyShadowsValueSchemaNonAliasableReturnType;
export function makeSpecifyShadowsValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyShadowsValueSchemaAliasableReturnType;
export function makeSpecifyShadowsValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyShadowsValueSchemaNonAliasableReturnType
  | MakeSpecifyShadowsValueSchemaAliasableReturnType;
export function makeSpecifyShadowsValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.array(makeSpecifyShadowValueSchema(isSupportingAliasing)).nonempty(),
  )(isSupportingAliasing);
}

export type SpecifyShadowsValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyShadowsValueSchema, [false]>
>;
export type SpecifyShadowsValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyShadowsValueSchema, [true]>
>;

export const specifyShadowsDefinition = createDesignTokenDefinition({
  type: specifyShadowsTypeName,
  aliasableValueZodSchema: makeSpecifyShadowsValueSchema(true),
  resolvedValueZodSchema: makeSpecifyShadowsValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [{ _tokenType: specifyShadowsTypeName }, { _arrayOf: [shadowTokenTypesMapping] }],
  },
});
