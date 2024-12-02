import { describe, it, expect } from 'vitest';

import { makeSpecifyHexadecimalColorStringValueSchema } from '../../../src/definitions/tokenTypes/_strings.js';

import { getMockedHexadecimalColorStringValue } from '../../../src/mocks/tokenTypes/_strings.js';

describe.concurrent('getMockedHexadecimalStringValue', () => {
  it('Should return a default mocked hexadecimal string value', () => {
    const value = getMockedHexadecimalColorStringValue();

    const result = makeSpecifyHexadecimalColorStringValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked hexadecimal string value with override', () => {
    const override = '#000000';

    const value = getMockedHexadecimalColorStringValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyHexadecimalColorStringValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
