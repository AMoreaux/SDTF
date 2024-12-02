import { describe, it, expect } from 'vitest';

import { makeSpecifyZIndexValueSchema } from '../../../src/definitions/tokenTypes/zIndex.js';

import { getMockedZIndexValue } from '../../../src/mocks/tokenTypes/zIndex.js';

describe('getMockedZIndexValue', () => {
  it('Should return a mocked z-index value', () => {
    const value = getMockedZIndexValue();

    expect(typeof value).toBe('number');

    const result = makeSpecifyZIndexValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return a mocked z-index value with override', () => {
    const override = 0;
    const value = getMockedZIndexValue(override);

    expect(value).toBe(override);
  });
});
