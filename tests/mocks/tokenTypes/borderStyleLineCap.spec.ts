import { describe, it, expect } from 'vitest';

import {
  makeSpecifyBorderStyleLineCapValueSchema,
  specifyBorderStyleLineCapValues,
} from '../../../src/definitions/tokenTypes/borderStyleLineCap.js';

import { getMockedBorderStyleLineCap } from '../../../src/mocks/tokenTypes/borderStyleLineCap.js';

describe.concurrent('getMockedBorderStyleLineCap', () => {
  it('Should return a default mocked border style line cap value', () => {
    const value = getMockedBorderStyleLineCap();
    expect(typeof value).toBe('string');
    expect(specifyBorderStyleLineCapValues).toContain(value);

    const result = makeSpecifyBorderStyleLineCapValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return a mocked border style line cap value with selector', () => {
    const selector = 'square';
    const value = getMockedBorderStyleLineCap(selector);
    expect(value).toStrictEqual(selector);
  });
});
