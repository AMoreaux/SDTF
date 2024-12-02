import { describe, it, expect } from 'vitest';

import { JSONParseIfString } from '../../../src/engine/utils/JSONParseIfString.js';

describe('JSONParseIfString', () => {
  it('should return the parsed JSON if the input is a string', () => {
    const input = { foo: 'bar' };
    const output = JSONParseIfString(JSON.stringify(input));
    expect(output).toStrictEqual(input);
  });

  it('should return the input if the input is not a string', () => {
    const input = { foo: 'bar' };
    const output = JSONParseIfString(input);
    expect(output).toStrictEqual(input);
  });
});
