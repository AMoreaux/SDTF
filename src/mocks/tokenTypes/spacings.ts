import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { SpecifySpacingsValue } from '../../definitions/tokenTypes/spacings.js';
import { getMockedSpacingValue } from './spacing.js';

export function getMockedSpacingsValue(override?: SpecifySpacingsValue): SpecifySpacingsValue {
  if (override !== undefined) {
    return override;
  }
  return new Array(pickRandomNumberInRange(1, 4))
    .fill(null)
    .map(() => getMockedSpacingValue()) as SpecifySpacingsValue;
}
