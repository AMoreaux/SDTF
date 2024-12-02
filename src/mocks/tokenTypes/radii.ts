import { SpecifyRadiiValue } from '../../definitions/tokenTypes/radii.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { getMockedRadiusValue } from './radius.js';

export function getMockedRadiiValue(override?: SpecifyRadiiValue) {
  if (override !== undefined) {
    return override;
  }
  return new Array(pickRandomNumberInRange(1, 4))
    .fill(null)
    .map(() => getMockedRadiusValue()) as SpecifyRadiiValue;
}
