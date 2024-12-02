import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { SpecifyShadowValue } from '../../definitions/tokenTypes/shadow.js';
import { getMockedColorValue } from './color.js';
import { getMockedDimensionValue } from './dimension.js';
import { getMockedRadiusValue } from './radius.js';
import { getMockedShadowTypeValue } from './shadowType.js';

export function getMockedShadowValue(partial?: Partial<SpecifyShadowValue>): SpecifyShadowValue {
  return {
    offsetX: getMockedDimensionValue({
      unit: 'px',
      value: pickRandomNumberInRange(-32, 32),
    }),
    offsetY: getMockedDimensionValue({
      unit: 'px',
      value: pickRandomNumberInRange(-32, 32),
    }),
    blurRadius: getMockedRadiusValue(),
    spreadRadius: getMockedRadiusValue(),
    color: getMockedColorValue(),
    type: getMockedShadowTypeValue(),
    ...partial,
  };
}
