import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyJSONStringValueSchema } from './_JSON.js';
import { makeSpecifyVectorFormatValueSchema } from './vectorFormat.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyJSONStringTypeName,
  specifyVectorFormatTypeName,
  specifyVectorTypeName,
} from '../designTokenTypeNames.js';

export const vectorProviderValues = ['external', 'Specify'] as const;
export type SpecifyVectorProvider = typeof vectorProviderValues[number];

export const specifyVectorProviderSchema = z.union([z.literal('external'), z.literal('Specify')]);

type MakeSpecifyVectorValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    url: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>;
    format: ReturnTypeWithArgs<typeof makeSpecifyVectorFormatValueSchema, [false]>;
    variationLabel: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>, z.ZodNull]
    >;
    provider: typeof specifyVectorProviderSchema;
  },
  'strict'
>;
type MakeSpecifyVectorValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        url: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>;
        format: ReturnTypeWithArgs<typeof makeSpecifyVectorFormatValueSchema, [true]>;
        variationLabel: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>, z.ZodNull]
        >;
        provider: typeof specifyVectorProviderSchema;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyVectorValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyVectorValueSchemaNonAliasableReturnType;
export function makeSpecifyVectorValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyVectorValueSchemaAliasableReturnType;
export function makeSpecifyVectorValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyVectorValueSchemaNonAliasableReturnType
  | MakeSpecifyVectorValueSchemaAliasableReturnType;
export function makeSpecifyVectorValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        url: makeSpecifyJSONStringValueSchema(isSupportingAliasing),
        format: makeSpecifyVectorFormatValueSchema(isSupportingAliasing),
        variationLabel: makeSpecifyJSONStringValueSchema(isSupportingAliasing).nullable(),
        provider: specifyVectorProviderSchema,
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyVectorValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyVectorValueSchema, [false]>
>;
export type SpecifyVectorValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyVectorValueSchema, [true]>
>;

export const vectorTokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyVectorTypeName },
    {
      _mapOf: {
        url: { _tokenType: specifyJSONStringTypeName },
        format: { _tokenType: specifyVectorFormatTypeName },
        variationLabel: { _tokenType: specifyJSONStringTypeName },
        provider: {
          _unionOf: vectorProviderValues.map(provider => ({ _primitive: provider })),
        },
      },
    },
  ],
};
export const specifyVectorDefinition = createDesignTokenDefinition({
  type: specifyVectorTypeName,
  aliasableValueZodSchema: makeSpecifyVectorValueSchema(true),
  resolvedValueZodSchema: makeSpecifyVectorValueSchema(false),
  tokenTypesMapping: vectorTokenTypesMapping,
});
