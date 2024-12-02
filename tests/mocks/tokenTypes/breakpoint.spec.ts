import { describe, it, expect } from 'vitest';

import { makeSpecifyBreakpointValueSchema } from '../../../src/definitions/tokenTypes/breakpoint.js';

import { getMockedBreakpointValue } from '../../../src/mocks/tokenTypes/breakpoint.js';

describe.concurrent('getMockedBreakpointValue', () => {
  it('Should return a mocked breakpoint value', () => {
    const value = getMockedBreakpointValue();

    expect(value).toHaveProperty('value');
    expect(value).toHaveProperty('unit');

    const result = makeSpecifyBreakpointValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked breakpoint value with partial', () => {
    const partial = {
      value: 0,
      unit: 'px',
    } as const;

    const value = getMockedBreakpointValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyBreakpointValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
