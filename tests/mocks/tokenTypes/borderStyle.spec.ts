import { describe, it, expect } from 'vitest';

import {
  makeSpecifyBorderStyleValueSchema,
  makeSpecifyNamedBorderStyleValueSchema,
} from '../../../src/definitions/tokenTypes/borderStyle.js';

import { getMockedBorderStyle } from '../../../src/mocks/tokenTypes/borderStyle.js';

describe.concurrent('getMockedBorderStyle', () => {
  it('Should return a default mocked border style', () => {
    const value = getMockedBorderStyle();

    const result = makeSpecifyBorderStyleValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked border style with namedStyleOnly', () => {
    const value = getMockedBorderStyle(undefined, true);

    expect(typeof value).toBe('string');

    const result = makeSpecifyNamedBorderStyleValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked border style with override', () => {
    const override = 'dashed';

    const value = getMockedBorderStyle(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyBorderStyleValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
