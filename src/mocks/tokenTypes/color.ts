import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import {
  SpecifyColorModelName,
  specifyColorModelNames,
  SpecifyColorValue,
} from '../../definitions/tokenTypes/color.js';
import { getMockedHexadecimalColorStringValue } from './_strings.js';
import {
  getMockedArcDegreeNumberValue,
  getMockedPercentageNumberValue,
  getMockedPositiveNumberValue,
  getMockedRGBColorNumberValue,
  getMockedZeroToOneNumberValue,
} from './_numbers.js';

export function getMockedColorValue(
  override?: SpecifyColorValue,
  model?: SpecifyColorModelName,
): SpecifyColorValue {
  if (override) {
    return override;
  }

  const finalModel = model || pickRandomInList(specifyColorModelNames);

  switch (finalModel) {
    case 'hex': {
      return {
        model: 'hex',
        alpha: getMockedZeroToOneNumberValue(),
        hex: getMockedHexadecimalColorStringValue(),
      };
    }
    case 'rgb': {
      return {
        model: 'rgb',
        alpha: getMockedZeroToOneNumberValue(),
        red: getMockedRGBColorNumberValue(),
        green: getMockedRGBColorNumberValue(),
        blue: getMockedRGBColorNumberValue(),
      };
    }
    case 'hsl': {
      return {
        model: 'hsl',
        alpha: getMockedZeroToOneNumberValue(),
        hue: getMockedArcDegreeNumberValue(),
        saturation: getMockedPercentageNumberValue(),
        lightness: getMockedPercentageNumberValue(),
      };
    }
    case 'hsb': {
      return {
        model: 'hsb',
        alpha: getMockedZeroToOneNumberValue(),
        hue: getMockedArcDegreeNumberValue(),
        saturation: getMockedPercentageNumberValue(),
        brightness: getMockedPercentageNumberValue(),
      };
    }
    case 'lch': {
      return {
        model: 'lch',
        alpha: getMockedZeroToOneNumberValue(),
        lightness: getMockedPercentageNumberValue(),
        chroma: getMockedPositiveNumberValue(),
        hue: getMockedArcDegreeNumberValue(),
      };
    }
    case 'lab': {
      return {
        model: 'lab',
        alpha: getMockedZeroToOneNumberValue(),
        lightness: getMockedPercentageNumberValue(),
        aAxis: pickRandomNumberInRange(-128, 127),
        bAxis: pickRandomNumberInRange(-128, 127),
      };
    }
    default: {
      const invalidType: never = finalModel;
      throw new Error(`Unhandled color model: "${invalidType}"`);
    }
  }
}
