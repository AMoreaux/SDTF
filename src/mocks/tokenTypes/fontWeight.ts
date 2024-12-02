import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import {
  SpecifyFontWeightValue,
  specifyNamedFontWeightValues,
} from '../../definitions/tokenTypes/fontWeight.js';

export function getMockedFontWeightValue(
  override?: SpecifyFontWeightValue,
): SpecifyFontWeightValue {
  return override !== undefined
    ? override
    : Math.random() > 0.5
    ? pickRandomInList(specifyNamedFontWeightValues)
    : pickRandomNumberInRange(100, 1000, 100);
}
