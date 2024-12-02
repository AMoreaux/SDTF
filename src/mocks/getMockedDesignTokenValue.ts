import { SpecifyDesignTokenTypeName } from '../definitions/index.js';

import {
  getMockedJSONArrayValue,
  getMockedJSONBooleanValue,
  getMockedJSONNullValue,
  getMockedJSONNumberValue,
  getMockedJSONObjectValue,
  getMockedJSONStringValue,
} from './tokenTypes/_JSON.js';
import {
  getMockedArcDegreeNumberValue,
  getMockedIntegerNumberValue,
  getMockedPercentageNumberValue,
  getMockedPositiveIntegerNumberValue,
  getMockedPositiveNumberValue,
  getMockedRGBColorNumberValue,
  getMockedZeroToOneNumberValue,
} from './tokenTypes/_numbers.js';
import { getMockedHexadecimalColorStringValue } from './tokenTypes/_strings.js';
import { getMockedBitmapFormatValue } from './tokenTypes/bitmapFormat.js';
import { getMockedBitmapValue } from './tokenTypes/bitmap.js';
import { getMockedBorderStyleLineCap } from './tokenTypes/borderStyleLineCap.js';
import { getMockedBorderStyle } from './tokenTypes/borderStyle.js';
import { getMockedCubicBezierValue } from './tokenTypes/cubicBezier.js';
import { getMockedDimensionUnitValue } from './tokenTypes/dimensionUnit.js';
import { getMockedDurationUnitValue } from './tokenTypes/durationUnit.js';
import { getMockedFontFamilyValue } from './tokenTypes/fontFamily.js';
import { getMockedFontFeatureValue } from './tokenTypes/fontFeature.js';
import { getMockedFontFeaturesValue } from './tokenTypes/fontFeatures.js';
import { getMockedFontFormatValue } from './tokenTypes/fontFormat.js';
import { getMockedFontStyleValue } from './tokenTypes/fontStyle.js';
import { getMockedFontWeightValue } from './tokenTypes/fontWeight.js';
import { getMockedTextAlignHorizontalValue } from './tokenTypes/textAlignHorizontal.js';
import { getMockedTextAlignVerticalValue } from './tokenTypes/textAlignVertical.js';
import { getMockedTextDecorationValue } from './tokenTypes/textDecoration.js';
import { getMockedTextTransformValue } from './tokenTypes/textTransform.js';
import { getMockedStepsTimingFunctionValue } from './tokenTypes/stepsTimingFunction.js';
import { getMockedVectorFormatValue } from './tokenTypes/vectorFormat.js';
import { getMockedBlurValue } from './tokenTypes/blur.js';
import { getMockedBorderValue } from './tokenTypes/border.js';
import { getMockedBreakpointValue } from './tokenTypes/breakpoint.js';
import { getMockedColorValue } from './tokenTypes/color.js';
import { getMockedDimensionValue } from './tokenTypes/dimension.js';
import { getMockedDurationValue } from './tokenTypes/duration.js';
import { getMockedFontValue } from './tokenTypes/font.js';
import { getMockedGradientsValue } from './tokenTypes/gradients.js';
import { getMockedGradientValue } from './tokenTypes/gradient.js';
import { getMockedOpacityValue } from './tokenTypes/opacity.js';
import { getMockedRadiiValue } from './tokenTypes/radii.js';
import { getMockedRadiusValue } from './tokenTypes/radius.js';
import { getMockedShadowValue } from './tokenTypes/shadow.js';
import { getMockedShadowsValue } from './tokenTypes/shadows.js';
import { getMockedShadowTypeValue } from './tokenTypes/shadowType.js';
import { getMockedSpacingValue } from './tokenTypes/spacing.js';
import { getMockedSpacingsValue } from './tokenTypes/spacings.js';
import { getMockedTextStyleValue } from './tokenTypes/textStyle.js';
import { getMockedTransitionValue } from './tokenTypes/transition.js';
import { getMockedVectorValue } from './tokenTypes/vector.js';
import { getMockedZIndexValue } from './tokenTypes/zIndex.js';
import { getMockedVectorsValue } from './tokenTypes/vectors.js';
import { getMockedBitmapsValue } from './tokenTypes/bitmaps.js';

export function getMockedDesignTokenValue(
  tokenType: 'string',
  ...args: Parameters<typeof getMockedJSONStringValue>
): ReturnType<typeof getMockedJSONStringValue>;
export function getMockedDesignTokenValue(
  tokenType: 'number',
  ...args: Parameters<typeof getMockedJSONNumberValue>
): ReturnType<typeof getMockedJSONNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'boolean',
  ...args: Parameters<typeof getMockedJSONBooleanValue>
): ReturnType<typeof getMockedJSONBooleanValue>;
export function getMockedDesignTokenValue(
  tokenType: 'null',
  ...args: Parameters<typeof getMockedJSONNullValue>
): ReturnType<typeof getMockedJSONNullValue>;
export function getMockedDesignTokenValue(
  tokenType: 'array',
  ...args: Parameters<typeof getMockedJSONArrayValue>
): ReturnType<typeof getMockedJSONArrayValue>;
export function getMockedDesignTokenValue(
  tokenType: 'object',
  ...args: Parameters<typeof getMockedJSONObjectValue>
): ReturnType<typeof getMockedJSONObjectValue>;
export function getMockedDesignTokenValue(
  tokenType: 'integerNumber',
  ...args: Parameters<typeof getMockedIntegerNumberValue>
): ReturnType<typeof getMockedIntegerNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'zeroToOneNumber',
  ...args: Parameters<typeof getMockedZeroToOneNumberValue>
): ReturnType<typeof getMockedZeroToOneNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'arcDegreeNumber',
  ...args: Parameters<typeof getMockedArcDegreeNumberValue>
): ReturnType<typeof getMockedArcDegreeNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'rgbColorNumber',
  ...args: Parameters<typeof getMockedRGBColorNumberValue>
): ReturnType<typeof getMockedRGBColorNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'positiveNumber',
  ...args: Parameters<typeof getMockedPositiveNumberValue>
): ReturnType<typeof getMockedPositiveNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'positiveIntegerNumber',
  ...args: Parameters<typeof getMockedPositiveIntegerNumberValue>
): ReturnType<typeof getMockedPositiveIntegerNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'percentageNumber',
  ...args: Parameters<typeof getMockedPercentageNumberValue>
): ReturnType<typeof getMockedPercentageNumberValue>;
export function getMockedDesignTokenValue(
  tokenType: 'hexadecimalColorString',
  ...args: Parameters<typeof getMockedHexadecimalColorStringValue>
): ReturnType<typeof getMockedHexadecimalColorStringValue>;
export function getMockedDesignTokenValue(
  tokenType: 'bitmap',
  ...args: Parameters<typeof getMockedBitmapValue>
): ReturnType<typeof getMockedBitmapValue>;
export function getMockedDesignTokenValue(
  tokenType: 'bitmapFormat',
  ...args: Parameters<typeof getMockedBitmapFormatValue>
): ReturnType<typeof getMockedBitmapFormatValue>;
export function getMockedDesignTokenValue(
  tokenType: 'bitmaps',
  ...args: Parameters<typeof getMockedBitmapsValue>
): ReturnType<typeof getMockedBitmapsValue>;
export function getMockedDesignTokenValue(
  tokenType: 'borderStyleLineCap',
  ...args: Parameters<typeof getMockedBorderStyleLineCap>
): ReturnType<typeof getMockedBorderStyleLineCap>;
export function getMockedDesignTokenValue(
  tokenType: 'borderStyle',
  ...args: Parameters<typeof getMockedBorderStyle>
): ReturnType<typeof getMockedBorderStyle>;
export function getMockedDesignTokenValue(
  tokenType: 'cubicBezier',
  ...args: Parameters<typeof getMockedCubicBezierValue>
): ReturnType<typeof getMockedCubicBezierValue>;
export function getMockedDesignTokenValue(
  tokenType: 'dimensionUnit',
  ...args: Parameters<typeof getMockedDimensionUnitValue>
): ReturnType<typeof getMockedDimensionUnitValue>;
export function getMockedDesignTokenValue(
  tokenType: 'durationUnit',
  ...args: Parameters<typeof getMockedDurationUnitValue>
): ReturnType<typeof getMockedDurationUnitValue>;
export function getMockedDesignTokenValue(
  tokenType: 'fontFamily',
  ...args: Parameters<typeof getMockedFontFamilyValue>
): ReturnType<typeof getMockedFontFamilyValue>;
export function getMockedDesignTokenValue(
  tokenType: 'fontFeature',
  ...args: Parameters<typeof getMockedFontFeatureValue>
): ReturnType<typeof getMockedFontFeatureValue>;
export function getMockedDesignTokenValue(
  tokenType: 'fontFeatures',
  ...args: Parameters<typeof getMockedFontFeaturesValue>
): ReturnType<typeof getMockedFontFeaturesValue>;
export function getMockedDesignTokenValue(
  tokenType: 'fontFormat',
  ...args: Parameters<typeof getMockedFontFormatValue>
): ReturnType<typeof getMockedFontFormatValue>;
export function getMockedDesignTokenValue(
  tokenType: 'fontStyle',
  ...args: Parameters<typeof getMockedFontStyleValue>
): ReturnType<typeof getMockedFontStyleValue>;
export function getMockedDesignTokenValue(
  tokenType: 'fontWeight',
  ...args: Parameters<typeof getMockedFontWeightValue>
): ReturnType<typeof getMockedFontWeightValue>;
export function getMockedDesignTokenValue(
  tokenType: 'textAlignHorizontal',
  ...args: Parameters<typeof getMockedTextAlignHorizontalValue>
): ReturnType<typeof getMockedTextAlignHorizontalValue>;
export function getMockedDesignTokenValue(
  tokenType: 'textAlignVertical',
  ...args: Parameters<typeof getMockedTextAlignVerticalValue>
): ReturnType<typeof getMockedTextAlignVerticalValue>;
export function getMockedDesignTokenValue(
  tokenType: 'textDecoration',
  ...args: Parameters<typeof getMockedTextDecorationValue>
): ReturnType<typeof getMockedTextDecorationValue>;
export function getMockedDesignTokenValue(
  tokenType: 'textTransform',
  ...args: Parameters<typeof getMockedTextTransformValue>
): ReturnType<typeof getMockedTextTransformValue>;
export function getMockedDesignTokenValue(
  tokenType: 'stepsTimingFunction',
  ...args: Parameters<typeof getMockedStepsTimingFunctionValue>
): ReturnType<typeof getMockedStepsTimingFunctionValue>;
export function getMockedDesignTokenValue(
  tokenType: 'vectorFormat',
  ...args: Parameters<typeof getMockedVectorFormatValue>
): ReturnType<typeof getMockedVectorFormatValue>;
export function getMockedDesignTokenValue(
  tokenType: 'blur',
  ...args: Parameters<typeof getMockedBlurValue>
): ReturnType<typeof getMockedBlurValue>;
export function getMockedDesignTokenValue(
  tokenType: 'border',
  ...args: Parameters<typeof getMockedBorderValue>
): ReturnType<typeof getMockedBorderValue>;
export function getMockedDesignTokenValue(
  tokenType: 'breakpoint',
  ...args: Parameters<typeof getMockedBreakpointValue>
): ReturnType<typeof getMockedBreakpointValue>;
export function getMockedDesignTokenValue(
  tokenType: 'color',
  ...args: Parameters<typeof getMockedColorValue>
): ReturnType<typeof getMockedColorValue>;
export function getMockedDesignTokenValue(
  tokenType: 'dimension',
  ...args: Parameters<typeof getMockedDimensionValue>
): ReturnType<typeof getMockedDimensionValue>;
export function getMockedDesignTokenValue(
  tokenType: 'duration',
  ...args: Parameters<typeof getMockedDurationValue>
): ReturnType<typeof getMockedDurationValue>;
export function getMockedDesignTokenValue(
  tokenType: 'font',
  ...args: Parameters<typeof getMockedFontValue>
): ReturnType<typeof getMockedFontValue>;
export function getMockedDesignTokenValue(
  tokenType: 'gradient',
  ...args: Parameters<typeof getMockedGradientValue>
): ReturnType<typeof getMockedGradientValue>;
export function getMockedDesignTokenValue(
  tokenType: 'gradients',
  ...args: Parameters<typeof getMockedGradientsValue>
): ReturnType<typeof getMockedGradientsValue>;
export function getMockedDesignTokenValue(
  tokenType: 'opacity',
  ...args: Parameters<typeof getMockedOpacityValue>
): ReturnType<typeof getMockedOpacityValue>;
export function getMockedDesignTokenValue(
  tokenType: 'radii',
  ...args: Parameters<typeof getMockedRadiiValue>
): ReturnType<typeof getMockedRadiiValue>;
export function getMockedDesignTokenValue(
  tokenType: 'radius',
  ...args: Parameters<typeof getMockedRadiusValue>
): ReturnType<typeof getMockedRadiusValue>;
export function getMockedDesignTokenValue(
  tokenType: 'shadow',
  ...args: Parameters<typeof getMockedShadowValue>
): ReturnType<typeof getMockedShadowValue>;
export function getMockedDesignTokenValue(
  tokenType: 'shadows',
  ...args: Parameters<typeof getMockedShadowsValue>
): ReturnType<typeof getMockedShadowsValue>;
export function getMockedDesignTokenValue(
  tokenType: 'shadowType',
  ...args: Parameters<typeof getMockedShadowTypeValue>
): ReturnType<typeof getMockedShadowTypeValue>;
export function getMockedDesignTokenValue(
  tokenType: 'spacing',
  ...args: Parameters<typeof getMockedSpacingValue>
): ReturnType<typeof getMockedSpacingValue>;
export function getMockedDesignTokenValue(
  tokenType: 'spacings',
  ...args: Parameters<typeof getMockedSpacingsValue>
): ReturnType<typeof getMockedSpacingsValue>;
export function getMockedDesignTokenValue(
  tokenType: 'textStyle',
  ...args: Parameters<typeof getMockedTextStyleValue>
): ReturnType<typeof getMockedTextStyleValue>;
export function getMockedDesignTokenValue(
  tokenType: 'transition',
  ...args: Parameters<typeof getMockedTransitionValue>
): ReturnType<typeof getMockedTransitionValue>;
export function getMockedDesignTokenValue(
  tokenType: 'vector',
  ...args: Parameters<typeof getMockedVectorValue>
): ReturnType<typeof getMockedVectorValue>;
export function getMockedDesignTokenValue(
  tokenType: 'vectors',
  ...args: Parameters<typeof getMockedVectorsValue>
): ReturnType<typeof getMockedVectorsValue>;
export function getMockedDesignTokenValue(
  tokenType: 'zIndex',
  ...args: Parameters<typeof getMockedZIndexValue>
): ReturnType<typeof getMockedZIndexValue>;
export function getMockedDesignTokenValue(
  tokenType: SpecifyDesignTokenTypeName,
  ...args: Array<any>
) {
  switch (tokenType) {
    case 'string':
      return getMockedJSONStringValue(...args);
    case 'number':
      return getMockedJSONNumberValue(...args);
    case 'boolean':
      return getMockedJSONBooleanValue(...args);
    case 'null':
      return getMockedJSONNullValue();
    case 'array':
      return getMockedJSONArrayValue(...args);
    case 'object':
      return getMockedJSONObjectValue(...args);
    case 'integerNumber':
      return getMockedIntegerNumberValue();
    case 'zeroToOneNumber':
      return getMockedZeroToOneNumberValue();
    case 'arcDegreeNumber':
      return getMockedArcDegreeNumberValue();
    case 'rgbColorNumber':
      return getMockedRGBColorNumberValue();
    case 'positiveNumber':
      return getMockedPositiveNumberValue();
    case 'positiveIntegerNumber':
      return getMockedPositiveIntegerNumberValue();
    case 'percentageNumber':
      return getMockedPercentageNumberValue();
    case 'hexadecimalColorString':
      return getMockedHexadecimalColorStringValue(...args);
    case 'bitmap':
      return getMockedBitmapValue(...args);
    case 'bitmaps':
      return getMockedBitmapsValue(...args);
    case 'bitmapFormat':
      return getMockedBitmapFormatValue(...args);
    case 'borderStyleLineCap':
      return getMockedBorderStyleLineCap(...args);
    case 'borderStyle':
      return getMockedBorderStyle(...args);
    case 'cubicBezier':
      return getMockedCubicBezierValue(...args);
    case 'dimensionUnit':
      return getMockedDimensionUnitValue(...args);
    case 'durationUnit':
      return getMockedDurationUnitValue(...args);
    case 'fontFamily':
      return getMockedFontFamilyValue(...args);
    case 'fontFeature':
      return getMockedFontFeatureValue(...args);
    case 'fontFeatures':
      return getMockedFontFeaturesValue(...args);
    case 'fontFormat':
      return getMockedFontFormatValue(...args);
    case 'fontStyle':
      return getMockedFontStyleValue(...args);
    case 'fontWeight':
      return getMockedFontWeightValue(...args);
    case 'textAlignHorizontal':
      return getMockedTextAlignHorizontalValue(...args);
    case 'textAlignVertical':
      return getMockedTextAlignVerticalValue(...args);
    case 'textDecoration':
      return getMockedTextDecorationValue(...args);
    case 'textTransform':
      return getMockedTextTransformValue(...args);
    case 'stepsTimingFunction':
      return getMockedStepsTimingFunctionValue(...args);
    case 'vectorFormat':
      return getMockedVectorFormatValue(...args);
    case 'blur':
      return getMockedBlurValue(...args);
    case 'border':
      return getMockedBorderValue(...args);
    case 'breakpoint':
      return getMockedBreakpointValue(...args);
    case 'color':
      return getMockedColorValue(...args);
    case 'dimension':
      return getMockedDimensionValue(...args);
    case 'duration':
      return getMockedDurationValue(...args);
    case 'font':
      return getMockedFontValue(...args);
    case 'gradient':
      return getMockedGradientValue(...args);
    case 'gradients':
      return getMockedGradientsValue(...args);
    case 'opacity':
      return getMockedOpacityValue(...args);
    case 'radii':
      return getMockedRadiiValue(...args);
    case 'radius':
      return getMockedRadiusValue(...args);
    case 'shadow':
      return getMockedShadowValue(...args);
    case 'shadows':
      return getMockedShadowsValue(...args);
    case 'shadowType':
      return getMockedShadowTypeValue(...args);
    case 'spacing':
      return getMockedSpacingValue(...args);
    case 'spacings':
      return getMockedSpacingsValue(...args);
    case 'textStyle':
      return getMockedTextStyleValue(...args);
    case 'transition':
      return getMockedTransitionValue(...args);
    case 'vector':
      return getMockedVectorValue(...args);
    case 'vectors':
      return getMockedVectorsValue(...args);
    case 'zIndex':
      return getMockedZIndexValue(...args);
    default: {
      const invalidType: never = tokenType;
      throw new Error(`Unknown token type: "${invalidType}"`);
    }
  }
}
