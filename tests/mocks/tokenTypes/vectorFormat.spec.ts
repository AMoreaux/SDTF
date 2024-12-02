import { describe, it, expect } from 'vitest';

import { makeSpecifyVectorFormatValueSchema } from '../../../src/definitions/tokenTypes/vectorFormat.js';

import { getMockedVectorFormatValue } from '../../../src/mocks/tokenTypes/vectorFormat.js';

describe.concurrent('getMockedVectorFormatValue', () => {
  it('Should return a mocked vector value with nulls', () => {
    const value = getMockedVectorFormatValue();
    expect(typeof value).toBe('string');

    const result = makeSpecifyVectorFormatValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked vector value with override', () => {
    const override = 'pdf';

    const value = getMockedVectorFormatValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyVectorFormatValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
