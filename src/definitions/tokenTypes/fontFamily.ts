import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { SpecifyJSONStringValue, SpecifyJSONStringValueWithAlias } from './_JSON.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyFontFamilyTypeName } from '../designTokenTypeNames.js';

export const makeSpecifyFontFamilyValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.string().min(1),
);
export type SpecifyFontFamilyValue = SpecifyJSONStringValue; // not using z.infer for performance optimization
export type SpecifyFontFamilyValueWithAlias = SpecifyJSONStringValueWithAlias; // not using z.infer for performance optimization

export const specifyFontFamilyDefinition = createDesignTokenDefinition({
  type: specifyFontFamilyTypeName,
  aliasableValueZodSchema: makeSpecifyFontFamilyValueSchema(true),
  resolvedValueZodSchema: makeSpecifyFontFamilyValueSchema(false),
});
