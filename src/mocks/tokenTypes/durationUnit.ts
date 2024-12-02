import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyDurationUnitValue,
  specifyDurationUnitValues,
} from '../../definitions/tokenTypes/durationUnit.js';

export function getMockedDurationUnitValue(
  override?: SpecifyDurationUnitValue,
): SpecifyDurationUnitValue {
  return override ?? pickRandomInList(specifyDurationUnitValues);
}
