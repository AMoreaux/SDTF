import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { makeSpecifyPositiveIntegerNumberValueSchema } from './_numbers.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyPositiveIntegerNumberTypeName,
  specifyStepsTimingFunctionTypeName,
} from '../designTokenTypeNames.js';

export const specifyStepsTimingFunctionJumpTermValues = [
  'start',
  'end',
  'jump-start',
  'jump-end',
  'jump-none',
  'jump-both',
] as const;
export type SpecifyStepsTimingFunctionJumpTermValue =
  typeof specifyStepsTimingFunctionJumpTermValues[number];

const stepsTimingFunctionJumpTermSchema = z.union([
  z.literal('start'),
  z.literal('end'),
  z.literal('jump-start'),
  z.literal('jump-end'),
  z.literal('jump-none'),
  z.literal('jump-both'),
]);

type MakeSpecifyStepsTimingFunctionValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    stepsCount: ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [false]>;
    jumpTerm: typeof stepsTimingFunctionJumpTermSchema;
  },
  'strict'
>;
type MakeSpecifyStepsTimingFunctionValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        stepsCount: ReturnTypeWithArgs<typeof makeSpecifyPositiveIntegerNumberValueSchema, [true]>;
        jumpTerm: typeof stepsTimingFunctionJumpTermSchema;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyStepsTimingFunctionValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyStepsTimingFunctionValueSchemaNonAliasableReturnType;
export function makeSpecifyStepsTimingFunctionValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyStepsTimingFunctionValueSchemaAliasableReturnType;
export function makeSpecifyStepsTimingFunctionValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyStepsTimingFunctionValueSchemaNonAliasableReturnType
  | MakeSpecifyStepsTimingFunctionValueSchemaAliasableReturnType;
export function makeSpecifyStepsTimingFunctionValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        stepsCount: makeSpecifyPositiveIntegerNumberValueSchema(isSupportingAliasing),
        jumpTerm: stepsTimingFunctionJumpTermSchema,
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyStepsTimingFunctionValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyStepsTimingFunctionValueSchema, [false]>
>;
export type SpecifyStepsTimingFunctionValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyStepsTimingFunctionValueSchema, [true]>
>;

export const specifyStepsTimingFunctionDefinition = createDesignTokenDefinition({
  type: specifyStepsTimingFunctionTypeName,
  aliasableValueZodSchema: makeSpecifyStepsTimingFunctionValueSchema(true),
  resolvedValueZodSchema: makeSpecifyStepsTimingFunctionValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyStepsTimingFunctionTypeName },
      {
        _mapOf: {
          stepsCount: { _tokenType: specifyPositiveIntegerNumberTypeName },
          jumpTerm: {
            _unionOf: specifyStepsTimingFunctionJumpTermValues.map(value => ({
              _primitive: value,
            })),
          },
        },
      },
    ],
  },
});
