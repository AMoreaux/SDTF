import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import {
  SpecifyArcDegreeNumberValue,
  SpecifyIntegerNumberValue,
  SpecifyPositiveIntegerNumberValue,
  SpecifyPositiveNumberValue,
  SpecifyRGBColorNumberValue,
  SpecifyZeroToOneNumberValue,
} from '../../definitions/tokenTypes/_numbers.js';

export function getMockedIntegerNumberValue(): SpecifyIntegerNumberValue {
  return pickRandomNumberInRange(-1000, 1000, 1);
}

export function getMockedZeroToOneNumberValue(): SpecifyZeroToOneNumberValue {
  return pickRandomNumberInRange(0, 1, 0.01);
}

export function getMockedArcDegreeNumberValue(): SpecifyArcDegreeNumberValue {
  return pickRandomNumberInRange(0, 359.99, 0.01);
}

export function getMockedRGBColorNumberValue(): SpecifyRGBColorNumberValue {
  return pickRandomNumberInRange(0, 255, 1);
}

export function getMockedPositiveNumberValue(): SpecifyPositiveNumberValue {
  return pickRandomNumberInRange(1, 1000, 0.01);
}

export function getMockedPositiveIntegerNumberValue(): SpecifyPositiveIntegerNumberValue {
  return pickRandomNumberInRange(1, 1000, 1);
}

export function getMockedPercentageNumberValue(): SpecifyPositiveNumberValue {
  return pickRandomNumberInRange(0, 100, 0.01);
}
