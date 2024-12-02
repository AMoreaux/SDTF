import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { fontTokenTypesMapping, makeSpecifyFontValueSchema } from './font.js';
import { specifyDimensionTokenTypesMapping, makeSpecifyDimensionValueSchema } from './dimension.js';
import { colorTokenTypesMapping, makeSpecifyColorValueSchema } from './color.js';
import { makeSpecifyFontFeaturesValueSchema } from './fontFeatures.js';
import { makeSpecifyTextAlignHorizontalValueSchema } from './textAlignHorizontal.js';
import { makeSpecifyTextAlignVerticalValueSchema } from './textAlignVertical.js';
import { makeSpecifyTextDecorationValueSchema } from './textDecoration.js';
import { makeSpecifyTextTransformValueSchema } from './textTransform.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyDimensionTypeName,
  specifyFontFeaturesTypeName,
  specifyFontFeatureTypeName,
  specifySpacingTypeName,
  specifyTextAlignHorizontalTypeName,
  specifyTextAlignVerticalTypeName,
  specifyTextDecorationTypeName,
  specifyTextStyleTypeName,
  specifyTextTransformTypeName,
} from '../designTokenTypeNames.js';
import { specifySpacingTokenTypesMapping } from './spacing.js';

type MakeSpecifyTextStyleValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    font: ReturnTypeWithArgs<typeof makeSpecifyFontValueSchema, [false]>;
    fontSize: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>;
    fontFeatures: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyFontFeaturesValueSchema, [false]>, z.ZodNull]
    >;
    color: z.ZodUnion<[ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>, z.ZodNull]>;
    lineHeight: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>, z.ZodNull]
    >;
    letterSpacing: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>, z.ZodNull]
    >;
    paragraphSpacing: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>, z.ZodNull]
    >;
    textAlignHorizontal: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyTextAlignHorizontalValueSchema, [false]>, z.ZodNull]
    >;
    textAlignVertical: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyTextAlignVerticalValueSchema, [false]>, z.ZodNull]
    >;
    textDecoration: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyTextDecorationValueSchema, [false]>, z.ZodNull]
    >;
    textIndent: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>, z.ZodNull]
    >;
    textTransform: z.ZodUnion<
      [ReturnTypeWithArgs<typeof makeSpecifyTextTransformValueSchema, [false]>, z.ZodNull]
    >;
  },
  'strict'
>;
type MakeSpecifyTextStyleValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        font: ReturnTypeWithArgs<typeof makeSpecifyFontValueSchema, [true]>;
        fontSize: ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>;
        fontFeatures: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyFontFeaturesValueSchema, [true]>, z.ZodNull]
        >;
        color: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>, z.ZodNull]
        >;
        lineHeight: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>, z.ZodNull]
        >;
        letterSpacing: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>, z.ZodNull]
        >;
        paragraphSpacing: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>, z.ZodNull]
        >;
        textAlignHorizontal: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyTextAlignHorizontalValueSchema, [true]>, z.ZodNull]
        >;
        textAlignVertical: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyTextAlignVerticalValueSchema, [true]>, z.ZodNull]
        >;
        textDecoration: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyTextDecorationValueSchema, [true]>, z.ZodNull]
        >;
        textIndent: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>, z.ZodNull]
        >;
        textTransform: z.ZodUnion<
          [ReturnTypeWithArgs<typeof makeSpecifyTextTransformValueSchema, [true]>, z.ZodNull]
        >;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyTextStyleValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyTextStyleValueSchemaNonAliasableReturnType;
export function makeSpecifyTextStyleValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyTextStyleValueSchemaAliasableReturnType;
export function makeSpecifyTextStyleValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyTextStyleValueSchemaNonAliasableReturnType
  | MakeSpecifyTextStyleValueSchemaAliasableReturnType;
export function makeSpecifyTextStyleValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        font: makeSpecifyFontValueSchema(isSupportingAliasing),
        fontSize: makeSpecifyDimensionValueSchema(isSupportingAliasing),
        color: makeSpecifyColorValueSchema(isSupportingAliasing).nullable(),
        fontFeatures: makeSpecifyFontFeaturesValueSchema(isSupportingAliasing).nullable(),
        lineHeight: makeSpecifyDimensionValueSchema(isSupportingAliasing).nullable(),
        letterSpacing: makeSpecifyDimensionValueSchema(isSupportingAliasing).nullable(),
        paragraphSpacing: makeSpecifyDimensionValueSchema(isSupportingAliasing).nullable(),
        textAlignHorizontal:
          makeSpecifyTextAlignHorizontalValueSchema(isSupportingAliasing).nullable(),
        textAlignVertical: makeSpecifyTextAlignVerticalValueSchema(isSupportingAliasing).nullable(),
        textDecoration: makeSpecifyTextDecorationValueSchema(isSupportingAliasing).nullable(),
        textIndent: makeSpecifyDimensionValueSchema(isSupportingAliasing).nullable(),
        textTransform: makeSpecifyTextTransformValueSchema(isSupportingAliasing).nullable(),
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyTextStyleValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextStyleValueSchema, [false]>
>;
export type SpecifyTextStyleValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTextStyleValueSchema, [true]>
>;

export const specifyTextStyleDefinition = createDesignTokenDefinition({
  type: specifyTextStyleTypeName,
  aliasableValueZodSchema: makeSpecifyTextStyleValueSchema(true),
  resolvedValueZodSchema: makeSpecifyTextStyleValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyTextStyleTypeName },
      {
        _mapOf: {
          font: fontTokenTypesMapping,
          fontSize: specifyDimensionTokenTypesMapping,
          color: colorTokenTypesMapping,
          fontFeatures: {
            _unionOf: [
              { _tokenType: specifyFontFeaturesTypeName },
              { _arrayOf: [{ _tokenType: specifyFontFeatureTypeName }] },
            ],
          },
          lineHeight: { _tokenType: specifyDimensionTypeName },
          letterSpacing: {
            _unionOf: [
              ...specifyDimensionTokenTypesMapping._unionOf,
              ...specifySpacingTokenTypesMapping._unionOf,
            ],
          },
          paragraphSpacing: {
            _unionOf: [
              { _tokenType: specifyDimensionTypeName },
              { _tokenType: specifySpacingTypeName },
            ],
          },
          textAlignHorizontal: { _tokenType: specifyTextAlignHorizontalTypeName },
          textAlignVertical: { _tokenType: specifyTextAlignVerticalTypeName },
          textDecoration: { _tokenType: specifyTextDecorationTypeName },
          textIndent: {
            _unionOf: [
              ...specifyDimensionTokenTypesMapping._unionOf,
              ...specifySpacingTokenTypesMapping._unionOf,
            ],
          },
          textTransform: { _tokenType: specifyTextTransformTypeName },
        },
      },
    ],
  },
});
