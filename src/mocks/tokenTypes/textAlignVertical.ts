import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyTextAlignVerticalValue,
  specifyTextAlignVerticalValues,
} from '../../definitions/tokenTypes/textAlignVertical.js';

export function getMockedTextAlignVerticalValue(
  override?: SpecifyTextAlignVerticalValue,
): SpecifyTextAlignVerticalValue {
  return override ?? pickRandomInList(specifyTextAlignVerticalValues);
}
