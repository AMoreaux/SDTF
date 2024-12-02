import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyVectorValueSchema, vectorTokenTypesMapping } from './vector.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyVectorsTypeName } from '../designTokenTypeNames.js';

type MakeSpecifyVectorsValueSchemaNonAliasableReturnType = z.ZodObject<{
  files: z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyVectorValueSchema, [false]>, 'atleastone'>;
}>;
type MakeSpecifyVectorsValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<{
      files: z.ZodArray<
        ReturnTypeWithArgs<typeof makeSpecifyVectorValueSchema, [true]>,
        'atleastone'
      >;
    }>,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;

export function makeSpecifyVectorsValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyVectorsValueSchemaNonAliasableReturnType;
export function makeSpecifyVectorsValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyVectorsValueSchemaAliasableReturnType;
export function makeSpecifyVectorsValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.object({ files: z.array(makeSpecifyVectorValueSchema(isSupportingAliasing)).nonempty() }),
  )(isSupportingAliasing);
}

export type SpecifyVectorsValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyVectorsValueSchema, [false]>
>;
export type SpecifyVectorsValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyVectorsValueSchema, [true]>
>;

export const specifyVectorsDefinition = createDesignTokenDefinition({
  type: specifyVectorsTypeName,
  aliasableValueZodSchema: makeSpecifyVectorsValueSchema(true),
  resolvedValueZodSchema: makeSpecifyVectorsValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyVectorsTypeName },
      { _mapOf: { files: { _arrayOf: [vectorTokenTypesMapping] } } },
    ],
  },
});
