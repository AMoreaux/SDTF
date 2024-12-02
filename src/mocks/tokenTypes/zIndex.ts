import { SpecifyZIndexValue } from '../../definitions/tokenTypes/zIndex.js';
import { getMockedPositiveIntegerNumberValue } from './_numbers.js';

export function getMockedZIndexValue(override?: SpecifyZIndexValue): SpecifyZIndexValue {
  if (override !== undefined) {
    return override;
  }
  return getMockedPositiveIntegerNumberValue();
}
