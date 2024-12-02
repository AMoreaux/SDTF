import { z } from 'zod';

import {
  SpecifyModeAndValueLevelAliasSignatureSchema,
  specifyModeAndValueLevelAliasSignatureSchema,
} from './designTokenAlias.js';

// makeUnionWithModeAndValueLevelAliasValue is defined to help TS map out the adequate return types
export function makeUnionWithModeAndValueLevelAliasValue<T>(schema: z.ZodSchema<T>) {
  function computeAliasingSupport(isSupportingAliasing: false): z.ZodType<T>;
  function computeAliasingSupport(
    isSupportingAliasing: true,
  ): z.ZodUnion<[z.ZodType<T>, SpecifyModeAndValueLevelAliasSignatureSchema]>;
  function computeAliasingSupport(
    isSupportingAliasing: boolean,
  ): z.ZodType<T> | z.ZodUnion<[z.ZodType<T>, SpecifyModeAndValueLevelAliasSignatureSchema]>;

  function computeAliasingSupport(isSupportingAliasing: boolean) {
    return isSupportingAliasing
      ? z.union([schema, specifyModeAndValueLevelAliasSignatureSchema])
      : schema;
  }

  return computeAliasingSupport;
}
