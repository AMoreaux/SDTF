import { describe, it, expect } from 'vitest';

import { makeSpecifyDurationValueSchema } from '../../../src/definitions/tokenTypes/duration.js';

import { getMockedDurationValue } from '../../../src/mocks/tokenTypes/duration.js';

describe.concurrent('getMockedDurationValue', () => {
  it('Should return a mocked duration value', () => {
    const value = getMockedDurationValue();

    expect(value).toHaveProperty('value');
    expect(value).toHaveProperty('unit');

    const result = makeSpecifyDurationValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked duration value with partial', () => {
    const partial = {
      value: 0.5,
      unit: 's' as const,
    };

    const value = getMockedDurationValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyDurationValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
