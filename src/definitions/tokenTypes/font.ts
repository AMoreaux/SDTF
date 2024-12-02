import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyFontFamilyValueSchema } from './fontFamily.js';
import { makeSpecifyJSONStringValueSchema } from './_JSON.js';
import { makeSpecifyFontWeightValueSchema } from './fontWeight.js';
import { makeSpecifyFontStyleValueSchema } from './fontStyle.js';
import { makeSpecifyFontFormatValueSchema } from './fontFormat.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyFontFamilyTypeName,
  specifyFontFormatTypeName,
  specifyFontStyleTypeName,
  specifyFontTypeName,
  specifyFontWeightTypeName,
  specifyJSONStringTypeName,
} from '../designTokenTypeNames.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';

export const specifyFontProviderValues = [
  'external',
  'Specify',
  'Google Fonts',
  'Adobe Fonts',
] as const;
export type SpecifyFontProvider = typeof specifyFontProviderValues[number];

export const specifyFontProviderSchema = z.union([
  z.literal('external'),
  z.literal('Specify'),
  z.literal('Google Fonts'),
  z.literal('Adobe Fonts'),
]);

type MakeSpecifyFontValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    family: ReturnTypeWithArgs<typeof makeSpecifyFontFamilyValueSchema, [false]>;
    postScriptName: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>;
    weight: ReturnTypeWithArgs<typeof makeSpecifyFontWeightValueSchema, [false]>;
    style: ReturnTypeWithArgs<typeof makeSpecifyFontStyleValueSchema, [false]>;
    files: z.ZodArray<
      z.ZodObject<
        {
          url: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>;
          format: ReturnTypeWithArgs<typeof makeSpecifyFontFormatValueSchema, [false]>;
          provider: typeof specifyFontProviderSchema;
        },
        'strict'
      >
    >;
  },
  'strict'
>;
type MakeSpecifyFontValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        family: ReturnTypeWithArgs<typeof makeSpecifyFontFamilyValueSchema, [true]>;
        postScriptName: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>;
        weight: ReturnTypeWithArgs<typeof makeSpecifyFontWeightValueSchema, [true]>;
        style: ReturnTypeWithArgs<typeof makeSpecifyFontStyleValueSchema, [true]>;
        files: z.ZodArray<
          z.ZodObject<
            {
              url: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>;
              format: ReturnTypeWithArgs<typeof makeSpecifyFontFormatValueSchema, [true]>;
              provider: typeof specifyFontProviderSchema;
            },
            'strict'
          >
        >;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyFontValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyFontValueSchemaNonAliasableReturnType;
export function makeSpecifyFontValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyFontValueSchemaAliasableReturnType;
export function makeSpecifyFontValueSchema(
  isSupportingAliasing: boolean,
): MakeSpecifyFontValueSchemaNonAliasableReturnType | MakeSpecifyFontValueSchemaAliasableReturnType;
export function makeSpecifyFontValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        family: makeSpecifyFontFamilyValueSchema(isSupportingAliasing),
        postScriptName: makeSpecifyJSONStringValueSchema(isSupportingAliasing),
        weight: makeSpecifyFontWeightValueSchema(isSupportingAliasing),
        style: makeSpecifyFontStyleValueSchema(isSupportingAliasing),
        files: z.array(
          z
            .object({
              url: makeSpecifyJSONStringValueSchema(isSupportingAliasing),
              format: makeSpecifyFontFormatValueSchema(isSupportingAliasing),
              provider: specifyFontProviderSchema,
            })
            .strict(),
        ),
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyFontValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontValueSchema, [false]>
>;
export type SpecifyFontValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyFontValueSchema, [true]>
>;

export const fontTokenTypesMapping: TokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyFontTypeName },
    {
      _mapOf: {
        family: {
          _tokenType: specifyFontFamilyTypeName,
        },
        postScriptName: {
          _tokenType: specifyJSONStringTypeName,
        },
        weight: {
          _tokenType: specifyFontWeightTypeName,
        },
        style: {
          _tokenType: specifyFontStyleTypeName,
        },
        files: {
          _arrayOf: [
            {
              _mapOf: {
                url: { _tokenType: specifyJSONStringTypeName },
                format: { _tokenType: specifyFontFormatTypeName },
                provider: {
                  _unionOf: specifyFontProviderValues.map(provider => ({ _primitive: provider })),
                },
              },
            },
          ],
        },
      },
    },
  ],
};

export const specifyFontDefinition = createDesignTokenDefinition({
  type: specifyFontTypeName,
  aliasableValueZodSchema: makeSpecifyFontValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontValueSchema(false),
  tokenTypesMapping: fontTokenTypesMapping,
});
