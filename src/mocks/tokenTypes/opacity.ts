import { SpecifyOpacityValue } from '../../definitions/tokenTypes/opacity.js';
import { getMockedZeroToOneNumberValue } from './_numbers.js';

export function getMockedOpacityValue(override?: SpecifyOpacityValue): SpecifyOpacityValue {
  return override ?? getMockedZeroToOneNumberValue();
}
