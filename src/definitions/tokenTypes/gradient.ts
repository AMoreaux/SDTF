import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';

import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import {
  makeSpecifyArcDegreeNumberValueSchema,
  makeSpecifyZeroToOneNumberValueSchema,
} from './_numbers.js';
import { colorTokenTypesMapping, makeSpecifyColorValueSchema } from './color.js';
import { makeSpecifyJSONStringValueSchema } from './_JSON.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyArcDegreeNumberTypeName,
  specifyGradientTypeName,
  specifyJSONStringTypeName,
  specifyZeroToOneNumberTypeName,
} from '../designTokenTypeNames.js';
import { TokenTypesMapping } from '../internals/tokenTypesMapping.js';

export const specifyGradientTypeValues = ['linear', 'radial', 'conic'] as const;
export type SpecifyGradientTypeValue = typeof specifyGradientTypeValues[number];

type MakeSpecifyGradientValueSchemaNonAliasableReturnType = z.ZodDiscriminatedUnion<
  'type',
  Array<
    | z.ZodObject<
        {
          type: z.ZodLiteral<'linear'>;
          angle: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [false]>;
          colorStops: z.ZodArray<
            z.ZodObject<
              {
                color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>;
                position: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
              },
              'strict'
            >,
            'atleastone'
          >;
        },
        'strict'
      >
    | z.ZodObject<
        {
          type: z.ZodLiteral<'radial'>;
          position: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>;
          colorStops: z.ZodArray<
            z.ZodObject<
              {
                color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>;
                position: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
              },
              'strict'
            >,
            'atleastone'
          >;
        },
        'strict'
      >
    | z.ZodObject<
        {
          type: z.ZodLiteral<'conic'>;
          angle: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [false]>;
          position: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [false]>;
          colorStops: z.ZodArray<
            z.ZodObject<
              {
                color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [false]>;
                position: ReturnTypeWithArgs<typeof makeSpecifyZeroToOneNumberValueSchema, [false]>;
              },
              'strict'
            >,
            'atleastone'
          >;
        },
        'strict'
      >
  >
>;
type MakeSpecifyGradientValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodDiscriminatedUnion<
      'type',
      Array<
        | z.ZodObject<
            {
              type: z.ZodLiteral<'linear'>;
              angle: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [true]>;
              colorStops: z.ZodArray<
                z.ZodObject<
                  {
                    color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>;
                    position: ReturnTypeWithArgs<
                      typeof makeSpecifyZeroToOneNumberValueSchema,
                      [true]
                    >;
                  },
                  'strict'
                >,
                'atleastone'
              >;
            },
            'strict'
          >
        | z.ZodObject<
            {
              type: z.ZodLiteral<'radial'>;
              position: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>;
              colorStops: z.ZodArray<
                z.ZodObject<
                  {
                    color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>;
                    position: ReturnTypeWithArgs<
                      typeof makeSpecifyZeroToOneNumberValueSchema,
                      [true]
                    >;
                  },
                  'strict'
                >,
                'atleastone'
              >;
            },
            'strict'
          >
        | z.ZodObject<
            {
              type: z.ZodLiteral<'conic'>;
              angle: ReturnTypeWithArgs<typeof makeSpecifyArcDegreeNumberValueSchema, [true]>;
              position: ReturnTypeWithArgs<typeof makeSpecifyJSONStringValueSchema, [true]>;
              colorStops: z.ZodArray<
                z.ZodObject<
                  {
                    color: ReturnTypeWithArgs<typeof makeSpecifyColorValueSchema, [true]>;
                    position: ReturnTypeWithArgs<
                      typeof makeSpecifyZeroToOneNumberValueSchema,
                      [true]
                    >;
                  },
                  'strict'
                >,
                'atleastone'
              >;
            },
            'strict'
          >
      >
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;

export function makeSpecifyGradientValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyGradientValueSchemaNonAliasableReturnType;
export function makeSpecifyGradientValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyGradientValueSchemaAliasableReturnType;
export function makeSpecifyGradientValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyGradientValueSchemaNonAliasableReturnType
  | MakeSpecifyGradientValueSchemaAliasableReturnType;

export function makeSpecifyGradientValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.discriminatedUnion('type', [
      z
        .object({
          type: z.literal('linear'),
          angle: makeSpecifyArcDegreeNumberValueSchema(isSupportingAliasing),
          colorStops: z
            .array(
              z
                .object({
                  color: makeSpecifyColorValueSchema(true),
                  position: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
                })
                .strict(),
            )
            .nonempty(),
        })
        .strict(),
      z
        .object({
          type: z.literal('radial'),
          position: makeSpecifyJSONStringValueSchema(isSupportingAliasing),
          colorStops: z
            .array(
              z
                .object({
                  color: makeSpecifyColorValueSchema(true),
                  position: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
                })
                .strict(),
            )
            .nonempty(),
        })
        .strict(),
      z
        .object({
          type: z.literal('conic'),
          angle: makeSpecifyArcDegreeNumberValueSchema(isSupportingAliasing),
          position: makeSpecifyJSONStringValueSchema(isSupportingAliasing),
          colorStops: z
            .array(
              z
                .object({
                  color: makeSpecifyColorValueSchema(true),
                  position: makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing),
                })
                .strict(),
            )
            .nonempty(),
        })
        .strict(),
    ]),
  )(isSupportingAliasing);
}

export type SpecifyGradientValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyGradientValueSchema, [false]>
>;
export type SpecifyGradientValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyGradientValueSchema, [true]>
>;

export const gradientTokenTypesMapping: TokenTypesMapping = {
  _unionOf: [
    { _tokenType: specifyGradientTypeName },
    {
      _discriminator: 'type',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            type: { _primitive: 'linear' },
            angle: { _tokenType: specifyArcDegreeNumberTypeName },
            colorStops: {
              _arrayOf: [
                {
                  _mapOf: {
                    color: colorTokenTypesMapping,
                    position: { _tokenType: specifyZeroToOneNumberTypeName },
                  },
                },
              ],
            },
          },
        },
        {
          _mapOf: {
            type: { _primitive: 'radial' },
            position: { _tokenType: specifyJSONStringTypeName },
            colorStops: {
              _arrayOf: [
                {
                  _mapOf: {
                    color: colorTokenTypesMapping,
                    position: { _tokenType: specifyZeroToOneNumberTypeName },
                  },
                },
              ],
            },
          },
        },
        {
          _mapOf: {
            type: { _primitive: 'conic' },
            angle: { _tokenType: specifyArcDegreeNumberTypeName },
            position: { _tokenType: specifyJSONStringTypeName },
            colorStops: {
              _arrayOf: [
                {
                  _mapOf: {
                    color: colorTokenTypesMapping,
                    position: { _tokenType: specifyZeroToOneNumberTypeName },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  ],
};

// This schema has been created specicically for the update
// The color validation being handled on his own side, we don't care about validating it here
export const specifyGradientPartialAlisableValueColorStops = z
  .array(
    z
      .object({
        position: makeSpecifyZeroToOneNumberValueSchema(true),
      })
      .passthrough()
      .partial(),
  )
  .nonempty();

export const specifyGradientDefinition = createDesignTokenDefinition({
  type: specifyGradientTypeName,
  aliasableValueZodSchema: makeSpecifyGradientValueSchema(true),
  resolvedValueZodSchema: makeSpecifyGradientValueSchema(false),
  tokenTypesMapping: gradientTokenTypesMapping,
});
