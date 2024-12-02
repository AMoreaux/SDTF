import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyFontFormatValue,
  specifyFontFormatValues,
} from '../../definitions/tokenTypes/fontFormat.js';

export function getMockedFontFormatValue(
  override?: SpecifyFontFormatValue,
): SpecifyFontFormatValue {
  return override ?? pickRandomInList(specifyFontFormatValues);
}
