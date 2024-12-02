import { SpecifyBorderValue } from '../../definitions/tokenTypes/border.js';
import { getMockedDimensionValue } from './dimension.js';
import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { getMockedBorderStyle } from './borderStyle.js';
import { getMockedColorValue } from './color.js';

export function getMockedBorderValue(
  partial?: Partial<SpecifyBorderValue>,
  withNulls: boolean = true,
): SpecifyBorderValue {
  return {
    color: getMockedColorValue(),
    style: getMockedBorderStyle(),
    width: getMockedDimensionValue({
      value: pickRandomNumberInRange(1, 8),
      unit: pickRandomInList(['px', 'pt', 'em', 'rem'] as const),
    }),
    rectangleCornerRadii: withNulls
      ? null
      : [
          getMockedDimensionValue({
            value: pickRandomNumberInRange(1, 8),
            unit: pickRandomInList(['px', 'pt', 'em', 'rem'] as const),
          }),
          getMockedDimensionValue({
            value: pickRandomNumberInRange(1, 8),
            unit: pickRandomInList(['px', 'pt', 'em', 'rem'] as const),
          }),
          getMockedDimensionValue({
            value: pickRandomNumberInRange(1, 8),
            unit: pickRandomInList(['px', 'pt', 'em', 'rem'] as const),
          }),
          getMockedDimensionValue({
            value: pickRandomNumberInRange(1, 8),
            unit: pickRandomInList(['px', 'pt', 'em', 'rem'] as const),
          }),
        ],
    ...partial,
  };
}
