import { describe, it, expect } from 'vitest';

import { makeSpecifyShadowTypeValueSchema } from '../../../src/definitions/tokenTypes/shadowType.js';

import { getMockedShadowTypeValue } from '../../../src/mocks/tokenTypes/shadowType.js';

describe('getMockedShadowTypeValue', () => {
  it('Should return a mocked shadow type value', () => {
    const value = getMockedShadowTypeValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyShadowTypeValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked shadow type value with override', () => {
    const override = 'inner';

    const value = getMockedShadowTypeValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyShadowTypeValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
