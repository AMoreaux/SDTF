import { describe, expect, it } from 'vitest';

import {
  makeSpecifyRadiiValueSchema,
  SpecifyRadiiValue,
} from '../../../src/definitions/tokenTypes/radii.js';

import { getMockedRadiiValue } from '../../../src/mocks/tokenTypes/radii.js';

describe.concurrent('getMockedRadiiValue', () => {
  it('should return a mocked radii value', () => {
    const value = getMockedRadiiValue();

    expect(Array.isArray(value)).toBe(true);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value.length).toBeLessThanOrEqual(4);

    const result = makeSpecifyRadiiValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('should return a mocked radii value with override', () => {
    const override: SpecifyRadiiValue = [
      { unit: 'px', value: 1 },
      { unit: 'px', value: 2 },
    ];
    const value = getMockedRadiiValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyRadiiValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
