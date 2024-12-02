import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyJSONStringValueSchema } from './_JSON.js';
import { makeSpecifyBitmapFormatValueSchema } from './bitmapFormat.js';
import { makeSpecifyPositiveIntegerNumberValueSchema } from './_numbers.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyBitmapTypeName,
  specifyBitmapFormatTypeName,
  specifyPositiveIntegerNumberTypeName,
  specifyJSONStringTypeName,
} from '../designTokenTypeNames.js';

export const bitmapProviderValues = ['external', 'Specify'] as const;
export type SpecifyBitmapProvider = typeof bitmapProviderValues[number];

export const specifyBitmapProviderSchema = z.union([z.literal('external'), z.literal('Specify')]);

type MakeSpecifyBitmapValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    url: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>;
    format: ReturnTypeWithArgs<typeof makeSpecifyBitmapFormatValueSchema, [false]>;
    width: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [false]>, z.ZodNull]
    >;
    height: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [false]>, z.ZodNull]
    >;
    variationLabel: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>, z.ZodNull]
    >;
    provider: typeof specifyBitmapProviderSchema;
  },
  'strict'
>;
type MakeSpecifyBitmapValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        url: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>;
        format: ReturnTypeWithArgs<typeof makeSpecifyBitmapFormatValueSchema, [true]>;
        width: z.ZodUnion<
          [
            ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [true]>,
            z.ZodNull,
          ]
        >;
        height: z.ZodUnion<
          [
            ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [true]>,
            z.ZodNull,
          ]
        >;
        variationLabel: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>, z.ZodNull]
        >;
        provider: typeof specifyBitmapProviderSchema;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyBitmapValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyBitmapValueSchemaNonAliasableReturnType;
export function makeSpecifyBitmapValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyBitmapValueSchemaAliasableReturnType;
export function makeSpecifyBitmapValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyBitmapValueSchemaNonAliasableReturnType
  | MakeSpecifyBitmapValueSchemaAliasableReturnType;

export function makeSpecifyBitmapValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        url: makeSpecifyJSONStringValueSchema(isSupportingAliasing),
        format: makeSpecifyBitmapFormatValueSchema(isSupportingAliasing),
        width: makeSpecifyPositiveIntegerNumberValueSchema(isSupportingAliasing).nullable(),
        height: makeSpecifyPositiveIntegerNumberValueSchema(isSupportingAliasing).nullable(),
        variationLabel: makeSpecifyJSONStringValueSchema(isSupportingAliasing).nullable(),
        provider: specifyBitmapProviderSchema,
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyBitmapValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBitmapValueSchema, [false]>
>;
export type SpecifyBitmapValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBitmapValueSchema, [true]>
>;

export const bitmapTokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyBitmapTypeName },
    {
      _mapOf: {
        url: {
          _tokenType: specifyJSONStringTypeName,
        },
        format: {
          _tokenType: specifyBitmapFormatTypeName,
        },
        width: {
          _tokenType: specifyPositiveIntegerNumberTypeName,
        },
        height: {
          _tokenType: specifyPositiveIntegerNumberTypeName,
        },
        variationLabel: {
          _tokenType: specifyJSONStringTypeName,
        },
        provider: {
          _unionOf: bitmapProviderValues.map(provider => ({ _primitive: provider })),
        },
      },
    },
  ],
};

export const specifyBitmapDefinition = createDesignTokenDefinition({
  type: specifyBitmapTypeName,
  aliasableValueZodSchema: makeSpecifyBitmapValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBitmapValueSchema(false),
  tokenTypesMapping: bitmapTokenTypesMapping,
});
