import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { SpecifyRadiusValue } from '../../definitions/tokenTypes/radius.js';
import { getMockedDimensionValue } from './dimension.js';

export function getMockedRadiusValue(partial?: Partial<SpecifyRadiusValue>): SpecifyRadiusValue {
  return getMockedDimensionValue({
    value: pickRandomNumberInRange(1, 32),
    unit: 'px',
    ...partial,
  });
}
