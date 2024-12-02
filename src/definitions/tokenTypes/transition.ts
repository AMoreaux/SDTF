import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { SpecifyModeAndValueLevelAliasSignatureSchema } from '../internals/designTokenAlias.js';
import { makeSpecifyDurationValueSchema } from './duration.js';
import { makeSpecifyCubicBezierValueSchema } from './cubicBezier.js';
import { makeSpecifyStepsTimingFunctionValueSchema } from './stepsTimingFunction.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import {
  specifyCubicBezierTypeName,
  specifyDurationTypeName,
  specifyStepsTimingFunctionTypeName,
  specifyTransitionTypeName,
} from '../designTokenTypeNames.js';

type MakeSpecifyTransitionValueSchemaNonAliasableReturnType = z.ZodObject<
  {
    duration: ReturnTypeWithArgs<typeof makeSpecifyDurationValueSchema, [false]>;
    delay: ReturnTypeWithArgs<typeof makeSpecifyDurationValueSchema, [false]>;
    timingFunction: z.ZodUnion<
      [
        ReturnTypeWithArgs<typeof makeSpecifyCubicBezierValueSchema, [false]>,
        ReturnTypeWithArgs<typeof makeSpecifyStepsTimingFunctionValueSchema, [false]>,
      ]
    >;
  },
  'strict'
>;
type MakeSpecifyTransitionValueSchemaAliasableReturnType = z.ZodUnion<
  [
    z.ZodObject<
      {
        duration: ReturnTypeWithArgs<typeof makeSpecifyDurationValueSchema, [true]>;
        delay: ReturnTypeWithArgs<typeof makeSpecifyDurationValueSchema, [true]>;
        timingFunction: z.ZodUnion<
          [
            ReturnTypeWithArgs<typeof makeSpecifyCubicBezierValueSchema, [true]>,
            ReturnTypeWithArgs<typeof makeSpecifyStepsTimingFunctionValueSchema, [true]>,
          ]
        >;
      },
      'strict'
    >,
    SpecifyModeAndValueLevelAliasSignatureSchema,
  ]
>;
export function makeSpecifyTransitionValueSchema(
  isSupportingAliasing: false,
): MakeSpecifyTransitionValueSchemaNonAliasableReturnType;
export function makeSpecifyTransitionValueSchema(
  isSupportingAliasing: true,
): MakeSpecifyTransitionValueSchemaAliasableReturnType;
export function makeSpecifyTransitionValueSchema(
  isSupportingAliasing: boolean,
):
  | MakeSpecifyTransitionValueSchemaNonAliasableReturnType
  | MakeSpecifyTransitionValueSchemaAliasableReturnType;
export function makeSpecifyTransitionValueSchema(isSupportingAliasing: boolean) {
  return makeUnionWithModeAndValueLevelAliasValue(
    z
      .object({
        duration: makeSpecifyDurationValueSchema(isSupportingAliasing),
        delay: makeSpecifyDurationValueSchema(isSupportingAliasing),
        timingFunction: z.union([
          makeSpecifyCubicBezierValueSchema(isSupportingAliasing),
          makeSpecifyStepsTimingFunctionValueSchema(isSupportingAliasing),
        ]),
      })
      .strict(),
  )(isSupportingAliasing);
}

export type SpecifyTransitionValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTransitionValueSchema, [false]>
>;
export type SpecifyTransitionValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyTransitionValueSchema, [true]>
>;

export const specifyTransitionDefinition = createDesignTokenDefinition({
  type: specifyTransitionTypeName,
  aliasableValueZodSchema: makeSpecifyTransitionValueSchema(true),
  resolvedValueZodSchema: makeSpecifyTransitionValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyTransitionTypeName },
      {
        _mapOf: {
          duration: { _tokenType: specifyDurationTypeName },
          delay: { _tokenType: specifyDurationTypeName },
          timingFunction: {
            _unionOf: [
              { _tokenType: specifyCubicBezierTypeName },
              { _tokenType: specifyStepsTimingFunctionTypeName },
            ],
          },
        },
      },
    ],
  },
});
