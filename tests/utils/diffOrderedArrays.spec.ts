import { describe, expect, it } from 'vitest';

import { diffOrderedArrays } from '../../src/utils/diffOrderedArrays.js';

describe('diffOrderedArrays', () => {
  it('Should diff arrays taking indexes in account', async () => {
    expect(diffOrderedArrays([1, 2, 3, 4], [1, 2, 3, 4])).toEqual([]);
    expect(diffOrderedArrays([1, 2, 3, 4], [2, 3, 4])).toEqual([1]);
    expect(diffOrderedArrays([1, 2, 3, 4], [3, 4])).toEqual([1, 2]);
    expect(diffOrderedArrays([1, 2, 3, 4], [4])).toEqual([1, 2, 3]);
    expect(diffOrderedArrays([1, 2, 3, 4], [])).toEqual([1, 2, 3, 4]);
  });
});
