import { describe, it, expect } from 'vitest';
import { getArrayTail } from '../../src/utils/getArrayTail.js';

describe('getArrayTail', () => {
  it('should get the array tail value', async () => {
    const tail = getArrayTail([1, 2, 3]);
    expect(tail).toBe(3);
  });
  it('should get undefined if the array is empty', async () => {
    const tail = getArrayTail([]);
    expect(tail).toBe(undefined);
  });
  it('should fail if the array is undefined', async () => {
    expect(() =>
      getArrayTail(
        // @ts-expect-error
        undefined,
      ),
    ).toThrow();
  });
});
