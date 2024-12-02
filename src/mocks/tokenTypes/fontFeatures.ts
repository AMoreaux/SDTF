import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { SpecifyFontFeaturesValue } from '../../definitions/tokenTypes/fontFeatures.js';
import { specifyFontFeatureValues } from '../../definitions/tokenTypes/fontFeature.js';

export function getMockedFontFeaturesValue(
  override?: SpecifyFontFeaturesValue,
): SpecifyFontFeaturesValue {
  return (override ??
    new Array(pickRandomNumberInRange(1, 3))
      .fill(null)
      .map(() => pickRandomInList(specifyFontFeatureValues))) as SpecifyFontFeaturesValue;
}
