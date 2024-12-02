import { pickRandomInList } from '../../utils/mockGenerators.js';
import { getMockedDimensionValue } from './dimension.js';
import { SpecifyBreakpointValue } from '../../definitions/tokenTypes/breakpoint.js';

export function getMockedBreakpointValue(
  partial?: Partial<SpecifyBreakpointValue>,
): SpecifyBreakpointValue {
  if (Math.random() > 0.5) {
    return getMockedDimensionValue({
      value: pickRandomInList([320, 375, 414, 768, 1024, 1280, 1440, 1920]),
      unit: 'px',
      ...partial,
    });
  }
  return getMockedDimensionValue({
    value: pickRandomInList([20, 23.4375, 25.875, 48, 64, 80, 90, 120]),
    unit: 'em',
    ...partial,
  });
}
