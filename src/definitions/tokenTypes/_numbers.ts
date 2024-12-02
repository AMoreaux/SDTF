import { z } from 'zod';

import { SpecifyJSONNumberValue, SpecifyJSONNumberValueWithAlias } from './_JSON.js';
import { WithModeAndValueLevelAlias } from '../internals/designTokenAlias.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';

import {
  specifyArcDegreeNumberTypeName,
  specifyIntegerNumberTypeName,
  specifyPercentageNumberTypeName,
  specifyPositiveIntegerNumberTypeName,
  specifyPositiveNumberTypeName,
  specifyRGBColorNumberTypeName,
  specifyZeroToOneNumberTypeName,
} from '../designTokenTypeNames.js';

/* ==========================================
   Utility Specify Value Types
============================================= */
// Integer Number ]-∞,+∞[
export const makeSpecifyIntegerNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().int(),
);
export type SpecifyIntegerNumberValue = number;
export type SpecifyIntegerNumberValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyIntegerNumberValue>;
export const specifyIntegerNumberDefinition = createDesignTokenDefinition({
  type: specifyIntegerNumberTypeName,
  aliasableValueZodSchema: makeSpecifyIntegerNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyIntegerNumberValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyIntegerNumberTypeName },
      { _tokenType: specifyPositiveIntegerNumberTypeName },
    ],
  },
});

// Zero to One Number [0,1]
export const makeSpecifyZeroToOneNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().min(0).max(1),
);
export type SpecifyZeroToOneNumberValue = number;
export type SpecifyZeroToOneNumberValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyZeroToOneNumberValue>;
export const specifyZeroToOneDefinition = createDesignTokenDefinition({
  type: specifyZeroToOneNumberTypeName,
  aliasableValueZodSchema: makeSpecifyZeroToOneNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyZeroToOneNumberValueSchema(false),
});

// Arc Degree Number [0,360[
export const makeSpecifyArcDegreeNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().min(0).lt(360),
);
export type SpecifyArcDegreeNumberValue = number;
export type SpecifyArcDegreeNumberValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyArcDegreeNumberValue>;
export const specifyArcDegreeNumberDefinition = createDesignTokenDefinition({
  type: specifyArcDegreeNumberTypeName,
  aliasableValueZodSchema: makeSpecifyArcDegreeNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyArcDegreeNumberValueSchema(false),
});

// RGB Color Number [0,255]
export const makeSpecifyRGBColorNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().min(0).max(255),
);
export type SpecifyRGBColorNumberValue = number;
export type SpecifyRGBColorNumberValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyRGBColorNumberValue>;
export const specifyRGBColorNumberDefinition = createDesignTokenDefinition({
  type: specifyRGBColorNumberTypeName,
  aliasableValueZodSchema: makeSpecifyRGBColorNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyRGBColorNumberValueSchema(false),
});

// Positive Number [0,+∞[
export const makeSpecifyPositiveNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().min(0),
);
export type SpecifyPositiveNumberValue = number;
export type SpecifyPositiveNumberValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyPositiveNumberValue>;
export const specifyPositiveNumberDefinition = createDesignTokenDefinition({
  type: specifyPositiveNumberTypeName,
  aliasableValueZodSchema: makeSpecifyPositiveNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyPositiveNumberValueSchema(false),
  tokenTypesMapping: {
    _unionOf: [
      { _tokenType: specifyPositiveNumberTypeName },
      { _tokenType: specifyZeroToOneNumberTypeName },
      { _tokenType: specifyPositiveIntegerNumberTypeName },
    ],
  },
});

// Positive Integer Number [0,+∞[
export const makeSpecifyPositiveIntegerNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().int().min(0),
);
export type SpecifyPositiveIntegerNumberValue = number;
export type SpecifyPositiveIntegerNumberValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyPositiveIntegerNumberValue>;
export const specifyPositiveIntegerNumberDefinition = createDesignTokenDefinition({
  type: specifyPositiveIntegerNumberTypeName,
  aliasableValueZodSchema: makeSpecifyPositiveIntegerNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyPositiveIntegerNumberValueSchema(false),
});

// Percentage Number [0,100]
export const makeSpecifyPercentageNumberValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z.number().min(0).max(100),
);
export type SpecifyPercentageNumberValue = SpecifyJSONNumberValue;
export type SpecifyPercentageNumberValueWithAlias = SpecifyJSONNumberValueWithAlias;
export const specifyPercentageNumberDefinition = createDesignTokenDefinition({
  type: specifyPercentageNumberTypeName,
  aliasableValueZodSchema: makeSpecifyPercentageNumberValueSchema(true),
  resolvedValueZodSchema: makeSpecifyPercentageNumberValueSchema(false),
});
