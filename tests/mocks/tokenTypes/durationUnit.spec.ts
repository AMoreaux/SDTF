import { describe, it, expect } from 'vitest';

import { makeSpecifyDurationUnitValueSchema } from '../../../src/definitions/tokenTypes/durationUnit.js';

import { getMockedDurationUnitValue } from '../../../src/mocks/tokenTypes/durationUnit.js';

describe.concurrent('getMockedDurationUnitValue', () => {
  it('Should return a mocked duration unit value', () => {
    const value = getMockedDurationUnitValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyDurationUnitValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked duration unit value with override', () => {
    const override = 's';

    const value = getMockedDurationUnitValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyDurationUnitValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
