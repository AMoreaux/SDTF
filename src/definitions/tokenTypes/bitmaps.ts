import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyBitmapValueSchema, bitmapTokenTypesMapping } from './bitmap.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyBitmapsTypeName } from '../designTokenTypeNames.js';

type MakeSpecifyBitmapsValueSchemaNonAliasableReturnType = z.ZodObject<{
  files: z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyBitmapValueSchema, [false]>, 'atleastone'>;
}>;
type MakeSpecifyBitmapsValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<{
      files: z.ZodArray<
        ReturnTypeWithArgs<typeof makeSpecifyBitmapValueSchema, [true]>,
        'atleastone'
      >;
    }>,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;

export function makeSpecifyBitmapsValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyBitmapsValueSchemaNonAliasableReturnType;
export function makeSpecifyBitmapsValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyBitmapsValueSchemaAliasableReturnType;
export function makeSpecifyBitmapsValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.object({
      files: z.array(makeSpecifyBitmapValueSchema(isSupportingAliasing)).nonempty(),
    }),
  )(isSupportingAliasing);
}

export type SpecifyBitmapsValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBitmapsValueSchema, [false]>
>;
export type SpecifyBitmapsValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBitmapsValueSchema, [true]>
>;

export const specifyBitmapsDefinition = createDesignTokenDefinition({
  type: specifyBitmapsTypeName,
  aliasableValueZodSchema: makeSpecifyBitmapsValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBitmapsValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyBitmapsTypeName },
      { _mapOf: { files: { _arrayOf: [bitmapTokenTypesMapping] } } },
    ],
  },
});
