import { SpecifyBlurValue } from '../../definitions/tokenTypes/blur.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { getMockedDimensionValue } from './dimension.js';

export function getMockedBlurValue(partial?: Partial<SpecifyBlurValue>): SpecifyBlurValue {
  return getMockedDimensionValue({
    value: pickRandomNumberInRange(1, 32),
    unit: 'px',
    ...partial,
  });
}
