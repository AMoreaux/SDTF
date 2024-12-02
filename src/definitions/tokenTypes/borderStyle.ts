import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyBorderStyleLineCapValueSchema } from './borderStyleLineCap.js';
import { makeSpecifyDimensionValueSchema } from './dimension.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyBorderStyleTypeName } from '../designTokenTypeNames.js';

// Object Border Style
// The SpecifyObjectBorderStyleValue schema definition MUST NOT be used in functional SDTF code.
// It is defined to be a primitive definition of this very module. Export is test only.
type MakeSpecifyObjectBorderStyleValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    dashArray: z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [false]>>;
    lineCap: ReturnTypeWithArgs<typeof makeSpecifyBorderStyleLineCapValueSchema, [false]>;
  },
  'strict'
>;
type MakeSpecifyObjectBorderStyleValueSchemaAliasableReturnType = z.ZodObject<
  {
    dashArray: z.ZodArray<ReturnTypeWithArgs<typeof makeSpecifyDimensionValueSchema, [true]>>;
    lineCap: ReturnTypeWithArgs<typeof makeSpecifyBorderStyleLineCapValueSchema, [true]>;
  },
  'strict'
>;
export function makeSpecifyObjectBorderStyleValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyObjectBorderStyleValueSchemaNonAliasableReturnType;
export function makeSpecifyObjectBorderStyleValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyObjectBorderStyleValueSchemaAliasableReturnType;
export function makeSpecifyObjectBorderStyleValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyObjectBorderStyleValueSchemaNonAliasableReturnType
  | MakeSpecifyObjectBorderStyleValueSchemaAliasableReturnType;
export function makeSpecifyObjectBorderStyleValueSchema(isSupportingAliasing: boolean) {
  return z
    .object({
      dashArray: z.array(makeSpecifyDimensionValueSchema(isSupportingAliasing)),
      lineCap: makeSpecifyBorderStyleLineCapValueSchema(isSupportingAliasing),
    })
    .strict();
}

export type SpecifyObjectBorderStyleValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyObjectBorderStyleValueSchema, [false]>
>;
export type SpecifyObjectBorderStyleValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyObjectBorderStyleValueSchema, [true]>
>;

// Named Border Style
// The SpecifyNamedBorderStyleValue schema definition MUST NOT be used in functional SDTF code.
// It is defined to be a primitive definition of this very module. Export is test only.
export const specifyNamedBorderStyleValues = [
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
  'inherit',
  'initial',
  'unset',
] as const;
export const makeSpecifyNamedBorderStyleValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.union([
    z.literal('none'),
    z.literal('hidden'),
    z.literal('dotted'),
    z.literal('dashed'),
    z.literal('solid'),
    z.literal('double'),
    z.literal('groove'),
    z.literal('ridge'),
    z.literal('inset'),
    z.literal('outset'),
    z.literal('inherit'),
    z.literal('initial'),
    z.literal('unset'),
  ]),
);
export type SpecifyNamedBorderStyleValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyNamedBorderStyleValueSchema, [false]>
>;
export type SpecifyNamedBorderStyleValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyNamedBorderStyleValueSchema, [true]>
>;

// Border Style
type MakeSpecifyBorderStyleValueSchemaNonAliasableReturnType = z.ZodUnion<
  [
    ReturnTypeWithArgs<typeof makeSpecifyObjectBorderStyleValueSchema, [false]>,
    ReturnTypeWithArgs<typeof makeSpecifyNamedBorderStyleValueSchema, [false]>,
  ]
>;
type MakeSpecifyBorderStyleValueSchemaAliasableReturnType = z.ZodUnion<
  [
    ReturnTypeWithArgs<typeof makeSpecifyObjectBorderStyleValueSchema, [true]>,
    ReturnTypeWithArgs<typeof makeSpecifyNamedBorderStyleValueSchema, [true]>,
  ]
>;
export function makeSpecifyBorderStyleValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyBorderStyleValueSchemaNonAliasableReturnType;
export function makeSpecifyBorderStyleValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyBorderStyleValueSchemaAliasableReturnType;
export function makeSpecifyBorderStyleValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyBorderStyleValueSchemaNonAliasableReturnType
  | MakeSpecifyBorderStyleValueSchemaAliasableReturnType;
export function makeSpecifyBorderStyleValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z.union([
      makeSpecifyObjectBorderStyleValueSchema(isSupportingAliasing),
      makeSpecifyNamedBorderStyleValueSchema(isSupportingAliasing),
    ]),
  )(isSupportingAliasing);
}

export type SpecifyBorderStyleValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBorderStyleValueSchema, [false]>
>;
export type SpecifyBorderStyleValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyBorderStyleValueSchema, [true]>
>;

export const borderStyleDefinition = createDesignTokenDefinition({
  type: specifyBorderStyleTypeName,
  aliasableValueZodSchema: makeSpecifyBorderStyleValueSchema(true),
  resolvedValueZodSchema: makeSpecifyBorderStyleValueSchema(false),
});
