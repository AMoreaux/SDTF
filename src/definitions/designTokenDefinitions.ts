import { z } from 'zod';

import { SpecifyDesignTokenSignature } from './internals/designTokenSignature.js';

import {
  specifyJSONArrayDefinition,
  specifyJSONBooleanDefinition,
  specifyJSONNullDefinition,
  specifyJSONNumberDefinition,
  specifyJSONObjectDefinition,
  specifyJSONStringDefinition,
} from './tokenTypes/_JSON.js';
import {
  specifyArcDegreeNumberDefinition,
  specifyIntegerNumberDefinition,
  specifyPercentageNumberDefinition,
  specifyPositiveIntegerNumberDefinition,
  specifyPositiveNumberDefinition,
  specifyRGBColorNumberDefinition,
  specifyZeroToOneDefinition,
} from './tokenTypes/_numbers.js';
import { specifyHexadecimalColorStringDefinition } from './tokenTypes/_strings.js';
import { specifyBitmapDefinition } from './tokenTypes/bitmap.js';
import { specifyBitmapFormatDefinition } from './tokenTypes/bitmapFormat.js';
import { specifyBlurDefinition } from './tokenTypes/blur.js';
import { specifyBorderDefinition } from './tokenTypes/border.js';
import { borderStyleDefinition } from './tokenTypes/borderStyle.js';
import { specifyBorderStyleLineCapDefinition } from './tokenTypes/borderStyleLineCap.js';
import { specifyBreakpointDefinition } from './tokenTypes/breakpoint.js';
import { specifyColorDefinition } from './tokenTypes/color.js';
import { specifyCubicBezierDefinition } from './tokenTypes/cubicBezier.js';
import { specifyDimensionDefinition } from './tokenTypes/dimension.js';
import { specifyDimensionUnitDefinition } from './tokenTypes/dimensionUnit.js';
import { specifyDurationDefinition } from './tokenTypes/duration.js';
import { specifyDurationUnitDefinition } from './tokenTypes/durationUnit.js';
import { specifyFontFamilyDefinition } from './tokenTypes/fontFamily.js';
import { specifyFontDefinition } from './tokenTypes/font.js';
import { specifyFontFeatureDefinition } from './tokenTypes/fontFeature.js';
import { specifyFontFeaturesDefinition } from './tokenTypes/fontFeatures.js';
import { specifyFontFormatDefinition } from './tokenTypes/fontFormat.js';
import { specifyFontStyleDefinition } from './tokenTypes/fontStyle.js';
import { specifyFontWeightDefinition } from './tokenTypes/fontWeight.js';
import { specifyGradientDefinition } from './tokenTypes/gradient.js';
import { specifyGradientsDefinition } from './tokenTypes/gradients.js';
import { specifyOpacityDefinition } from './tokenTypes/opacity.js';
import { specifyRadiiDefinition } from './tokenTypes/radii.js';
import { specifyRadiusDefinition } from './tokenTypes/radius.js';
import { specifyShadowDefinition } from './tokenTypes/shadow.js';
import { specifyShadowsDefinition } from './tokenTypes/shadows.js';
import { specifyShadowTypeDefinition } from './tokenTypes/shadowType.js';
import { specifySpacingDefinition } from './tokenTypes/spacing.js';
import { specifySpacingsDefinition } from './tokenTypes/spacings.js';
import { specifyStepsTimingFunctionDefinition } from './tokenTypes/stepsTimingFunction.js';
import { specifyTextAlignHorizontalDefinition } from './tokenTypes/textAlignHorizontal.js';
import { specifyTextAlignVerticalDefinition } from './tokenTypes/textAlignVertical.js';
import { specifyTextDecorationDefinition } from './tokenTypes/textDecoration.js';
import { specifyTextStyleDefinition } from './tokenTypes/textStyle.js';
import { specifyTextTransformDefinition } from './tokenTypes/textTransform.js';
import { specifyTransitionDefinition } from './tokenTypes/transition.js';
import { specifyVectorDefinition } from './tokenTypes/vector.js';
import { specifyVectorFormatDefinition } from './tokenTypes/vectorFormat.js';
import { specifyZIndexDefinition } from './tokenTypes/zIndex.js';
import { SDTFError } from '../errors/index.js';
import { specifyVectorsDefinition } from './tokenTypes/vectors.js';
import { specifyBitmapsDefinition } from './tokenTypes/bitmaps.js';

export const specifyDesignTokenDefinitions = [
  specifyJSONStringDefinition,
  specifyJSONNumberDefinition,
  specifyJSONBooleanDefinition,
  specifyJSONNullDefinition,
  specifyJSONArrayDefinition,
  specifyJSONObjectDefinition,
  specifyIntegerNumberDefinition,
  specifyZeroToOneDefinition,
  specifyArcDegreeNumberDefinition,
  specifyRGBColorNumberDefinition,
  specifyPositiveNumberDefinition,
  specifyPositiveIntegerNumberDefinition,
  specifyPercentageNumberDefinition,
  specifyHexadecimalColorStringDefinition,
  specifyBitmapDefinition,
  specifyBitmapFormatDefinition,
  specifyBitmapsDefinition,
  specifyBlurDefinition,
  specifyBorderDefinition,
  borderStyleDefinition,
  specifyBorderStyleLineCapDefinition,
  specifyBreakpointDefinition,
  specifyColorDefinition,
  specifyCubicBezierDefinition,
  specifyDimensionDefinition,
  specifyDimensionUnitDefinition,
  specifyDurationDefinition,
  specifyDurationUnitDefinition,
  specifyFontDefinition,
  specifyFontFamilyDefinition,
  specifyFontFeatureDefinition,
  specifyFontFeaturesDefinition,
  specifyFontFormatDefinition,
  specifyFontStyleDefinition,
  specifyFontWeightDefinition,
  specifyGradientDefinition,
  specifyGradientsDefinition,
  specifyOpacityDefinition,
  specifyRadiiDefinition,
  specifyRadiusDefinition,
  specifyShadowDefinition,
  specifyShadowsDefinition,
  specifyShadowTypeDefinition,
  specifySpacingDefinition,
  specifySpacingsDefinition,
  specifyStepsTimingFunctionDefinition,
  specifyTextAlignHorizontalDefinition,
  specifyTextAlignVerticalDefinition,
  specifyTextDecorationDefinition,
  specifyTextStyleDefinition,
  specifyTextTransformDefinition,
  specifyTransitionDefinition,
  specifyVectorDefinition,
  specifyVectorFormatDefinition,
  specifyVectorsDefinition,
  specifyZIndexDefinition,
] as const;

export const specifyDesignTokenTypeNames = Object.freeze(
  specifyDesignTokenDefinitions.map(definition => definition.type),
);

const designTokenDefinitionsMap = specifyDesignTokenDefinitions.reduce(
  (acc, definition) => ({ ...acc, [definition.type]: definition }),
  {} as SpecifyDesignTokenDefinitionsMap,
);
export function getDesignTokenDefinition<T extends keyof SpecifyDesignTokenDefinitionsMap>(
  type: T,
): SpecifyDesignTokenDefinitionsMap[T] {
  if (!designTokenDefinitionsMap[type]) {
    throw new SDTFError('SDTF_UNKNOWN_TOKEN_TYPE', `Unknown design token type: "${type}".`);
  }
  return designTokenDefinitionsMap[type];
}

// const specifyTokenTypeNameSchema = z.union(
//   // @ts-expect-error
//   specifyTokenTypeNames.map(c => z.literal(c)),
// ) as z.Schema<z.ZodUnion<[z.ZodLiteral<SpecifyTokenTypeName>]>>;

export const specifyAliasableDesignTokenSchema = z.discriminatedUnion(
  '$type',
  specifyDesignTokenDefinitions.map(definition => definition.aliasableTokenZodSchema) as any,
) as z.ZodDiscriminatedUnion<
  '$type',
  Array<DesignTokenDefinitionsUnion['aliasableTokenZodSchema']>
>;
export function validateSpecifyAliasableDesignToken(maybeToken: unknown) {
  return specifyAliasableDesignTokenSchema.parse(maybeToken);
}

export const specifyNonAliasableDesignTokenSchema = z.discriminatedUnion(
  '$type',
  specifyDesignTokenDefinitions.map(definition => definition.resolvedTokenZodSchema) as any,
) as z.ZodDiscriminatedUnion<'$type', Array<DesignTokenDefinitionsUnion['resolvedTokenZodSchema']>>;
export function validateSpecifyNonAliasableDesignToken(maybeToken: unknown) {
  return specifyNonAliasableDesignTokenSchema.parse(maybeToken);
}

type DesignTokenDefinitionsUnion = typeof specifyDesignTokenDefinitions[number]; // Union of all design token definitions
type DesignTokenDefinitionsTuple = typeof specifyDesignTokenDefinitions;
type SpecifyDesignTokenDefinitionsMap = {
  [T in DesignTokenDefinitionsTuple[number]['type']]: DesignTokenDefinitionsTuple[number];
};
type DistributeOverDefinitionsUnion<
  DefinitionsUnion,
  Mode extends string,
  WithAliases extends boolean,
  WithModes extends boolean,
> = DefinitionsUnion extends {
  type: infer Type;
  aliasableValueZodSchema: infer ASchema;
  resolvedValueZodSchema: infer RSchema;
}
  ? Type extends string
    ? WithAliases extends true
      ? ASchema extends z.Schema
        ? SpecifyDesignTokenSignature<Type, z.infer<ASchema>, Mode, WithModes, WithAliases>
        : never
      : RSchema extends z.Schema
      ? SpecifyDesignTokenSignature<Type, z.infer<RSchema>, Mode, WithModes, WithAliases>
      : never
    : never
  : never;

export type DesignTokenDistributedOverDefinitionsUnion<
  Mode extends string,
  WithAliases extends boolean,
  WithModes extends boolean,
> = DistributeOverDefinitionsUnion<DesignTokenDefinitionsUnion, Mode, WithAliases, WithModes>;

export type SpecifyDesignTokenTypeName = DesignTokenDefinitionsUnion['type'];

export const specifyDesignTokenTypeNameSchema = z.union(
  // @ts-expect-error
  specifyDesignTokenDefinitions.map(c => z.literal(c.type)),
) as z.Schema<SpecifyDesignTokenTypeName>;

export function validateSpecifyDesignTokenTypeName(typeName: unknown) {
  return specifyDesignTokenTypeNameSchema.parse(typeName);
}
