import { describe, expect, it } from 'vitest';

import {
  makeSpecifySpacingsValueSchema,
  SpecifySpacingsValue,
} from '../../../src/definitions/tokenTypes/spacings.js';

import { getMockedSpacingsValue } from '../../../src/mocks/tokenTypes/spacings.js';

describe.concurrent('getMockedSpacingsValue', () => {
  it('should return a mocked spacings value', () => {
    const value = getMockedSpacingsValue();

    expect(Array.isArray(value)).toBe(true);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value.length).toBeLessThanOrEqual(4);

    const result = makeSpecifySpacingsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('should return a mocked spacings value with override', () => {
    const override: SpecifySpacingsValue = [
      { unit: 'px', value: 1 },
      { unit: 'px', value: 2 },
    ];
    const value = getMockedSpacingsValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifySpacingsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
