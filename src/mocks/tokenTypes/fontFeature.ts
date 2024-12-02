import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyFontFeatureValue,
  specifyFontFeatureValues,
} from '../../definitions/tokenTypes/fontFeature.js';

export function getMockedFontFeatureValue(
  override?: SpecifyFontFeatureValue,
): SpecifyFontFeatureValue {
  return override ?? pickRandomInList(specifyFontFeatureValues);
}
