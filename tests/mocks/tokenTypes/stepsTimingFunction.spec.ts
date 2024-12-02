import { describe, it, expect } from 'vitest';

import {
  makeSpecifyStepsTimingFunctionValueSchema,
  SpecifyStepsTimingFunctionValue,
} from '../../../src/definitions/tokenTypes/stepsTimingFunction.js';

import { getMockedStepsTimingFunctionValue } from '../../../src/mocks/tokenTypes/stepsTimingFunction.js';

describe('getMockedStepsTimingFunctionValue', () => {
  it('Should return a mocked steps timing function value', () => {
    const value = getMockedStepsTimingFunctionValue();

    expect(value).toHaveProperty('stepsCount');
    expect(value).toHaveProperty('jumpTerm');

    const result = makeSpecifyStepsTimingFunctionValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked steps timing function value with partial', () => {
    const partial: SpecifyStepsTimingFunctionValue = {
      stepsCount: 32,
      jumpTerm: 'jump-start',
    };

    const value = getMockedStepsTimingFunctionValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyStepsTimingFunctionValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
