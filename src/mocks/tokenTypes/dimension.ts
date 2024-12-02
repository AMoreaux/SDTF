import { SpecifyDimensionValue } from '../../definitions/tokenTypes/dimension.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { getMockedDimensionUnitValue } from './dimensionUnit.js';

export function getMockedDimensionValue(
  partial?: Partial<SpecifyDimensionValue>,
): SpecifyDimensionValue {
  return {
    value: pickRandomNumberInRange(0, 100),
    unit: getMockedDimensionUnitValue(),
    ...partial,
  };
}
