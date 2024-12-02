import { SpecifyShadowsValue } from '../../definitions/tokenTypes/shadows.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { getMockedShadowValue } from './shadow.js';

export function getMockedShadowsValue(override?: SpecifyShadowsValue): SpecifyShadowsValue {
  if (override !== undefined) {
    return override;
  }
  return new Array(pickRandomNumberInRange(1, 3))
    .fill(null)
    .map(() => getMockedShadowValue()) as SpecifyShadowsValue;
}
