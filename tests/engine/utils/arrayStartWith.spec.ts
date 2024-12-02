import { describe, it, expect } from 'vitest';
import { arrayStartWith } from '../../../src/engine/utils/arrayStartWith.js';

describe('arrayStartWith', () => {
  it('should return true', () => {
    expect(arrayStartWith(['hello', 'world', 'sir'], ['hello'])).toBeTruthy();
    expect(arrayStartWith(['hello', 'world', 'sir'], ['hello', 'world'])).toBeTruthy();
    expect(arrayStartWith(['hello', 'world', 'sir'], ['hello', 'world', 'sir'])).toBeTruthy();
  });

  it('should return false', () => {
    expect(arrayStartWith(['hello', 'world', 'sir'], ['world'])).toBeFalsy();
    expect(arrayStartWith(['hello', 'world', 'sir'], ['world', 'wir'])).toBeFalsy();
    expect(arrayStartWith(['hello', 'world', 'sir'], ['hello', 'sir'])).toBeFalsy();
  });
});
