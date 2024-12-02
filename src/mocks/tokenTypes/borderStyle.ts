import {
  SpecifyBorderStyleValue,
  specifyNamedBorderStyleValues,
} from '../../definitions/tokenTypes/borderStyle.js';
import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { getMockedDimensionValue } from './dimension.js';
import { getMockedBorderStyleLineCap } from './borderStyleLineCap.js';

export function getMockedBorderStyle(
  override?: SpecifyBorderStyleValue,
  namedStyleOnly: boolean = false,
): SpecifyBorderStyleValue {
  if (override) {
    return override;
  }
  if (Math.random() > 0.5 || namedStyleOnly) {
    return pickRandomInList(specifyNamedBorderStyleValues);
  }
  return {
    dashArray: Array.from(new Array(pickRandomNumberInRange(2, 4))).map(() =>
      getMockedDimensionValue(),
    ),
    lineCap: getMockedBorderStyleLineCap(),
  };
}
