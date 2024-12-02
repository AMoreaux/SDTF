import { describe, it, expect } from 'vitest';
import { getMockedTextDecorationValue } from '../../../src/mocks/tokenTypes/textDecoration.js';
import { makeSpecifyTextDecorationValueSchema } from '../../../src/definitions/tokenTypes/textDecoration.js';

describe('getMockedTextDecorationValue', () => {
  it('Should return a mocked text-decoration value', () => {
    const value = getMockedTextDecorationValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyTextDecorationValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return a mocked text-decoration value with override', () => {
    const override = 'underline';
    const value = getMockedTextDecorationValue(override);

    expect(value).toBe(override);
  });
});
