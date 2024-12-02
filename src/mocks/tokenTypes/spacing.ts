import { SpecifySpacingValue } from '../../definitions/tokenTypes/spacing.js';
import { getMockedDimensionValue } from './dimension.js';

export function getMockedSpacingValue(partial?: Partial<SpecifySpacingValue>): SpecifySpacingValue {
  return getMockedDimensionValue(partial);
}
