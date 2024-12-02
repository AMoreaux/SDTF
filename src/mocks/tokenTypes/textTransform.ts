import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyTextTransformValue,
  specifyTextTransformValues,
} from '../../definitions/tokenTypes/textTransform.js';

export function getMockedTextTransformValue(
  override?: SpecifyTextTransformValue,
): SpecifyTextTransformValue {
  return override ?? pickRandomInList(specifyTextTransformValues);
}
