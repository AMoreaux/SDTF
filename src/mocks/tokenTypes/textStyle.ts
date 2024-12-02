import { SpecifyTextStyleValue } from '../../definitions/tokenTypes/textStyle.js';
import { getMockedFontValue } from './font.js';
import { getMockedDimensionValue } from './dimension.js';
import { getMockedColorValue } from './color.js';
import { getMockedFontFeaturesValue } from './fontFeatures.js';
import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { specifyDimensionUnitValues } from '../../definitions/tokenTypes/dimensionUnit.js';
import { getMockedTextAlignHorizontalValue } from './textAlignHorizontal.js';
import { getMockedTextAlignVerticalValue } from './textAlignVertical.js';
import { getMockedTextDecorationValue } from './textDecoration.js';
import { getMockedTextTransformValue } from './textTransform.js';

const fontDimensionUnits = specifyDimensionUnitValues.filter(
  u => u === '%' || u === 'px' || u === 'em' || u === 'rem' || u === 'pt',
);

export function getMockedTextStyleValue(
  partial?: Partial<SpecifyTextStyleValue>,
  withNulls: boolean = true,
): SpecifyTextStyleValue {
  const fontSize = getMockedDimensionValue({
    unit: pickRandomInList(fontDimensionUnits),
    value: pickRandomNumberInRange(12, 36, 4),
  });
  return {
    font: getMockedFontValue(),
    fontSize,
    color: withNulls ? null : getMockedColorValue(),
    fontFeatures: withNulls ? null : getMockedFontFeaturesValue(),
    lineHeight: withNulls
      ? null
      : {
          unit: fontSize.unit,
          value: pickRandomNumberInRange(fontSize.value, fontSize.value * 2, 0.1),
        },
    letterSpacing: withNulls
      ? null
      : getMockedDimensionValue({
          unit: 'px',
          value: pickRandomNumberInRange(-0.5, 0.5, 0.05),
        }),
    paragraphSpacing: withNulls
      ? null
      : getMockedDimensionValue({
          unit: 'px',
          value: pickRandomNumberInRange(0, 32, 4),
        }),
    textAlignHorizontal: withNulls ? null : getMockedTextAlignHorizontalValue(),
    textAlignVertical: withNulls ? null : getMockedTextAlignVerticalValue(),
    textDecoration: withNulls ? null : getMockedTextDecorationValue(),
    textIndent: withNulls
      ? null
      : getMockedDimensionValue({
          unit: 'px',
          value: pickRandomNumberInRange(0, 32, 4),
        }),
    textTransform: withNulls ? null : getMockedTextTransformValue(),
    ...partial,
  };
}
