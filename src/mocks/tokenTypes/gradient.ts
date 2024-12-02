import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyGradientTypeValue,
  specifyGradientTypeValues,
  SpecifyGradientValue,
} from '../../definitions/tokenTypes/gradient.js';
import { getMockedColorValue } from './color.js';
import { getMockedArcDegreeNumberValue } from './_numbers.js';

export function getMockedGradientValue(
  override?: SpecifyGradientValue,
  type?: SpecifyGradientTypeValue,
): SpecifyGradientValue {
  if (override !== undefined) {
    return override;
  }

  const finalType = type ?? pickRandomInList(specifyGradientTypeValues);

  const colorStops: SpecifyGradientValue['colorStops'] =
    Math.random() > 0.5
      ? [
          {
            color: getMockedColorValue(),
            position: 0,
          },
          {
            color: getMockedColorValue(),
            position: 1,
          },
        ]
      : [
          {
            color: getMockedColorValue(),
            position: 0,
          },
          {
            color: getMockedColorValue(),
            position: 0.5,
          },
          {
            color: getMockedColorValue(),
            position: 1,
          },
        ];

  switch (finalType) {
    case 'linear': {
      return {
        type: 'linear',
        angle: getMockedArcDegreeNumberValue(),
        colorStops,
      };
    }
    case 'radial': {
      return {
        type: 'radial',
        position: 'center',
        colorStops,
      };
    }
    case 'conic': {
      return {
        type: 'conic',
        angle: getMockedArcDegreeNumberValue(),
        position: 'center',
        colorStops,
      };
    }
    default: {
      const invalidType: never = finalType;
      throw new Error(`Unexpected gradient type: "${invalidType}"`);
    }
  }
}
