import { pickRandomInList } from '../../utils/mockGenerators.js';
import { specifyFontProviderValues, SpecifyFontValue } from '../../definitions/tokenTypes/font.js';
import { getMockedFontFamilyValue } from './fontFamily.js';
import { getMockedFontWeightValue } from './fontWeight.js';
import { getMockedFontStyleValue } from './fontStyle.js';

export function getMockedFontValue(partial?: Partial<SpecifyFontValue>): SpecifyFontValue {
  const family = getMockedFontFamilyValue();
  return {
    family,
    postScriptName: `${family}_postScriptName`,
    weight: getMockedFontWeightValue(),
    style: getMockedFontStyleValue(),
    files: [
      {
        url: `https://fonts.specifyapp.com/font.otf`,
        format: `otf`,
        provider: pickRandomInList(specifyFontProviderValues),
      },
      {
        url: `https://fonts.specifyapp.com/font.woff`,
        format: `woff`,
        provider: pickRandomInList(specifyFontProviderValues),
      },
    ],
    ...partial,
  };
}
