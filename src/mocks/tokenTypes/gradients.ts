import { SpecifyGradientsValue } from '../../definitions/tokenTypes/gradients.js';
import { getMockedGradientValue } from './gradient.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';

export function getMockedGradientsValue(override?: SpecifyGradientsValue): SpecifyGradientsValue {
  if (override !== undefined) {
    return override;
  }
  return new Array(pickRandomNumberInRange(1, 3))
    .fill(null)
    .map(() => getMockedGradientValue()) as SpecifyGradientsValue;
}
