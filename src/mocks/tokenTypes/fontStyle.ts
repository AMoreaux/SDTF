import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyFontStyleValue,
  specifyFontStyleValues,
} from '../../definitions/tokenTypes/fontStyle.js';

export function getMockedFontStyleValue(override?: SpecifyFontStyleValue): SpecifyFontStyleValue {
  return override ?? pickRandomInList(specifyFontStyleValues);
}
