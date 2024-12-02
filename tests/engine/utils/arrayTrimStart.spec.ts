import { describe, it, expect } from 'vitest';
import { arrayTrimStart } from '../../../src/engine/utils/arrayTrimStart.js';

describe('arrayTrimStart', () => {
  it('should trim correctly', () => {
    expect(arrayTrimStart(['hello', 'world', 'sir'], ['hello'])).toEqual(['world', 'sir']);
    expect(arrayTrimStart(['hello', 'world', 'sir'], ['hello', 'world'])).toEqual(['sir']);
    expect(arrayTrimStart(['hello', 'world', 'sir'], ['hello', 'world', 'sir'])).toEqual([]);
    expect(arrayTrimStart(['hello', 'world', 'sir'], ['hello', 'world', 'notSir'])).toEqual([
      'hello',
      'world',
      'sir',
    ]);
  });
});
