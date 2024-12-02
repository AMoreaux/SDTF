import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyTextAlignHorizontalValue,
  specifyTextAlignHorizontalValues,
} from '../../definitions/tokenTypes/textAlignHorizontal.js';

export function getMockedTextAlignHorizontalValue(
  override?: SpecifyTextAlignHorizontalValue,
): SpecifyTextAlignHorizontalValue {
  return override ?? pickRandomInList(specifyTextAlignHorizontalValues);
}
