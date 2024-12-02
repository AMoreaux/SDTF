import { describe, it, expect } from 'vitest';

import {
  makeSpecifyTransitionValueSchema,
  SpecifyTransitionValue,
} from '../../../src/definitions/tokenTypes/transition.js';

import { getMockedTransitionValue } from '../../../src/mocks/tokenTypes/transition.js';

describe('getMockedTransitionValue', () => {
  it('Should return a mocked transition value', () => {
    const value = getMockedTransitionValue();

    expect(value).toHaveProperty('duration');
    expect(value).toHaveProperty('delay');
    expect(value).toHaveProperty('timingFunction');

    expect(value.duration.value).toBe(value.delay.value * 2);
    expect(value.duration.unit).toBe(value.delay.unit);

    const result = makeSpecifyTransitionValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked transition value with override', () => {
    const override: SpecifyTransitionValue = {
      duration: {
        unit: 'ms',
        value: 200,
      },
      delay: {
        unit: 'ms',
        value: 50,
      },
      timingFunction: [0.1, 0.7, 1, 0.1],
    };
    const value = getMockedTransitionValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyTransitionValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
