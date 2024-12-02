import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyDimensionUnitValue,
  specifyDimensionUnitValues,
} from '../../definitions/tokenTypes/dimensionUnit.js';

export function getMockedDimensionUnitValue(
  selector?: SpecifyDimensionUnitValue,
): SpecifyDimensionUnitValue {
  if (selector) {
    return selector;
  }
  return pickRandomInList(specifyDimensionUnitValues);
}
