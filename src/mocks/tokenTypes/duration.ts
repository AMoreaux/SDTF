import { SpecifyDurationValue } from '../../definitions/tokenTypes/duration.js';
import { getMockedDurationUnitValue } from './durationUnit.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';

export function getMockedDurationValue(
  partial?: Partial<SpecifyDurationValue>,
): SpecifyDurationValue {
  const unit = partial && partial.unit ? partial.unit : getMockedDurationUnitValue();
  return {
    value:
      unit === 'ms' ? pickRandomNumberInRange(50, 300, 50) : pickRandomNumberInRange(0.1, 3, 0.1),
    unit,
    ...partial,
  };
}
