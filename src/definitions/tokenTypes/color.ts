import { z } from 'zod';

import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyHexadecimalColorStringValueSchema } from './_strings.js';
import {
  makeSpecifyArcDegreeNumberValueSchema,
  makeSpecifyPercentageNumberValueSchema,
  makeSpecifyPositiveNumberValueSchema,
  makeSpecifyRGBColorNumberValueSchema,
  makeSpecifyZeroToOneNumberValueSchema,
} from './_numbers.js';
import { makeSpecifyJSONNumberValueSchema } from './_JSON.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyArcDegreeNumberTypeName,
  specifyColorTypeName,
  specifyHexadecimalColorStringTypeName,
  specifyJSONNumberTypeName,
  specifyOpacityTypeName,
  specifyPercentageNumberTypeName,
  specifyPositiveNumberTypeName,
  specifyRGBColorNumberTypeName,
  specifyZeroToOneNumberTypeName,
} from '../designTokenTypeNames.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';

export const specifyColorModelNames = ['hex', 'rgb', 'hsl', 'hsb', 'lch', 'lab'] as const;
export type SpecifyColorModelName = typeof specifyColorModelNames[number];

type MakeSpecifyColorValueSchemaNonAliasableReturnType = z.ZodDiscriminatedUnion<
  'model',
  Array<
    | z.ZodObject<
        {
          model: z.ZodLiteral<'hex'>;
          hex: ReturnTypeWithArgs<typeof makeSpecifyHexadecimalColorStringValueSchema, [false]>;
          alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
        },
        'strict'
      >
    | z.ZodObject<
        {
          model: z.ZodLiteral<'rgb'>;
          red: ReturnTypeWithArgs<typeof makeSpecifyRGBColorNumberValueSchema, [false]>;
          green: ReturnTypeWithArgs<typeof makeSpecifyRGBColorNumberValueSchema, [false]>;
          blue: ReturnTypeWithArgs<typeof makeSpecifyRGBColorNumberValueSchema, [false]>;
          alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
        },
        'strict'
      >
    | z.ZodObject<
        {
          model: z.ZodLiteral<'hsl'>;
          hue: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [false]>;
          saturation: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [false]>;
          lightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [false]>;
          alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
        },
        'strict'
      >
    | z.ZodObject<
        {
          model: z.ZodLiteral<'hsb'>;
          hue: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [false]>;
          saturation: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [false]>;
          brightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [false]>;
          alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
        },
        'strict'
      >
    | z.ZodObject<
        {
          model: z.ZodLiteral<'lch'>;
          lightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [false]>;
          chroma: ReturnTypeWithArgs<typeof makeSpecifyPositiveNumberValueSchema, [false]>;
          hue: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [false]>;
          alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
        },
        'strict'
      >
    | z.ZodObject<
        {
          model: z.ZodLiteral<'lab'>;
          lightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [false]>;
          aAxis: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [false]>;
          bAxis: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [false]>;
          alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
        },
        'strict'
      >
  >
>;
type MakeSpecifyColorValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodDiscriminatedUnion<
      'model',
      Array<
        | z.ZodObject<
            {
              model: z.ZodLiteral<'hex'>;
              hex: ReturnTypeWithArgs<typeof makeSpecifyHexadecimalColorStringValueSchema, [true]>;
              alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>;
            },
            'strict'
          >
        | z.ZodObject<
            {
              model: z.ZodLiteral<'rgb'>;
              red: ReturnTypeWithArgs<typeof makeSpecifyRGBColorNumberValueSchema, [true]>;
              green: ReturnTypeWithArgs<typeof makeSpecifyRGBColorNumberValueSchema, [true]>;
              blue: ReturnTypeWithArgs<typeof makeSpecifyRGBColorNumberValueSchema, [true]>;
              alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>;
            },
            'strict'
          >
        | z.ZodObject<
            {
              model: z.ZodLiteral<'hsl'>;
              hue: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [true]>;
              saturation: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [true]>;
              lightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [true]>;
              alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>;
            },
            'strict'
          >
        | z.ZodObject<
            {
              model: z.ZodLiteral<'hsb'>;
              hue: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [true]>;
              saturation: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [true]>;
              brightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [true]>;
              alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>;
            },
            'strict'
          >
        | z.ZodObject<
            {
              model: z.ZodLiteral<'lch'>;
              lightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [true]>;
              chroma: ReturnTypeWithArgs<typeof makeSpecifyPositiveNumberValueSchema, [true]>;
              hue: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [true]>;
              alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>;
            },
            'strict'
          >
        | z.ZodObject<
            {
              model: z.ZodLiteral<'lab'>;
              lightness: ReturnTypeWithArgs<typeof makeSpecifyPercentageNumberValueSchema, [true]>;
              aAxis: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [true]>;
              bAxis: ReturnTypeWithArgs<typeof makeSpecifyJSONNumberValueSchema, [true]>;
              alpha: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [true]>;
            },
            'strict'
          >
      >
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyColorValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyColorValueSchemaNonAliasableReturnType;
export function makeSpecifyColorValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyColorValueSchemaAliasableReturnType;
export function makeSpecifyColorValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyColorValueSchemaNonAliasableReturnType
  | MakeSpecifyColorValueSchemaAliasableReturnType;
export function makeSpecifyColorValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.discriminatedUnion('model', [
      z
        .object({
          model: z.literal('hex'),
          hex: makeSpecifyHexadecimalColorStringValueSchema(isSupportingAliasing),
          alpha: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
        })
        .strict(),
      z
        .object({
          model: z.literal('rgb'),
          red: makeSpecifyRGBColorNumberValueSchema(isSupportingAliasing),
          green: makeSpecifyRGBColorNumberValueSchema(isSupportingAliasing),
          blue: makeSpecifyRGBColorNumberValueSchema(isSupportingAliasing),
          alpha: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
        })
        .strict(),
      z
        .object({
          model: z.literal('hsl'),
          hue: makeSpecifyArcDegreeNumberValueSchema(isSupportingAliasing),
          saturation: makeSpecifyPercentageNumberValueSchema(isSupportingAliasing),
          lightness: makeSpecifyPercentageNumberValueSchema(isSupportingAliasing),
          alpha: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
        })
        .strict(),
      z
        .object({
          model: z.literal('hsb'),
          hue: makeSpecifyArcDegreeNumberValueSchema(isSupportingAliasing),
          saturation: makeSpecifyPercentageNumberValueSchema(isSupportingAliasing),
          brightness: makeSpecifyPercentageNumberValueSchema(isSupportingAliasing),
          alpha: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
        })
        .strict(),
      z
        .object({
          model: z.literal('lch'),
          lightness: makeSpecifyPercentageNumberValueSchema(isSupportingAliasing),
          chroma: makeSpecifyPositiveNumberValueSchema(isSupportingAliasing),
          hue: makeSpecifyArcDegreeNumberValueSchema(isSupportingAliasing),
          alpha: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
        })
        .strict(),
      z
        .object({
          model: z.literal('lab'),
          lightness: makeSpecifyPercentageNumberValueSchema(isSupportingAliasing),
          aAxis: makeSpecifyJSONNumberValueSchema(isSupportingAliasing),
          bAxis: makeSpecifyJSONNumberValueSchema(isSupportingAliasing),
          alpha: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
        })
        .strict(),
    ]),
  )(isSupportingAliasing);
}

export type SpecifyColorValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>
>;
export type SpecifyColorValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>
>;

export const colorTokenTypesMapping: TokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyColorTypeName },
    {
      _discriminator: 'model',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            model: { _primitive: 'hex' },
            hex: { _tokenType: specifyHexadecimalColorStringTypeName },
            alpha: {
              _unionOf: [
                { _tokenType: specifyZeroToOneNumberTypeName },
                { _tokenType: specifyOpacityTypeName },
              ],
            },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'rgb' },
            red: { _tokenType: specifyRGBColorNumberTypeName },
            green: { _tokenType: specifyRGBColorNumberTypeName },
            blue: { _tokenType: specifyRGBColorNumberTypeName },
            alpha: {
              _unionOf: [
                { _tokenType: specifyZeroToOneNumberTypeName },
                { _tokenType: specifyOpacityTypeName },
              ],
            },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'hsl' },
            hue: { _tokenType: specifyArcDegreeNumberTypeName },
            saturation: { _tokenType: specifyPercentageNumberTypeName },
            lightness: { _tokenType: specifyPercentageNumberTypeName },
            alpha: {
              _unionOf: [
                { _tokenType: specifyZeroToOneNumberTypeName },
                { _tokenType: specifyOpacityTypeName },
              ],
            },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'hsb' },
            hue: { _tokenType: specifyArcDegreeNumberTypeName },
            saturation: { _tokenType: specifyPercentageNumberTypeName },
            brightness: { _tokenType: specifyPercentageNumberTypeName },
            alpha: {
              _unionOf: [
                { _tokenType: specifyZeroToOneNumberTypeName },
                { _tokenType: specifyOpacityTypeName },
              ],
            },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'lch' },
            lightness: { _tokenType: specifyPercentageNumberTypeName },
            chroma: { _tokenType: specifyPositiveNumberTypeName },
            hue: { _tokenType: specifyArcDegreeNumberTypeName },
            alpha: {
              _unionOf: [
                { _tokenType: specifyZeroToOneNumberTypeName },
                { _tokenType: specifyOpacityTypeName },
              ],
            },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'lab' },
            lightness: { _tokenType: specifyPercentageNumberTypeName },
            aAxis: { _tokenType: specifyJSONNumberTypeName },
            bAxis: { _tokenType: specifyJSONNumberTypeName },
            alpha: {
              _unionOf: [
                { _tokenType: specifyZeroToOneNumberTypeName },
                { _tokenType: specifyOpacityTypeName },
              ],
            },
          },
        },
      ],
    },
  ],
};

export const specifyColorDefinition = createDesignTokenDefinition({
  type: specifyColorTypeName,
  aliasableValueZodSchema: makeSpecifyColorValueSchema(true),
  resolvedValueZodSchema: makeSpecifyColorValueSchema(false),
  tokenTypesMapping: colorTokenTypesMapping,
});
