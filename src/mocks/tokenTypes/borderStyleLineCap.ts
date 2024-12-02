import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyBorderStyleLineCapValue,
  specifyBorderStyleLineCapValues,
} from '../../definitions/tokenTypes/borderStyleLineCap.js';

export function getMockedBorderStyleLineCap(
  selector?: SpecifyBorderStyleLineCapValue,
): SpecifyBorderStyleLineCapValue {
  if (selector) {
    return selector;
  }
  return pickRandomInList(specifyBorderStyleLineCapValues);
}
