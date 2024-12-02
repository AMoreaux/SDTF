import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';
import { createValueToTraverseFromPrefix } from '../../../src/engine/utils/createValueToTraverseFromPrefix.js';

describe('createValueToTraverseFromPrefix', () => {
  it('should create the value correctly', () => {
    expect(createValueToTraverseFromPrefix(new ValuePath(['hello', 'world', 'sir']), 0)).toEqual({
      hello: { world: { sir: 0 } },
    });
    expect(createValueToTraverseFromPrefix(new ValuePath([0, 'world', 'sir']), 0)).toEqual([
      {
        world: { sir: 0 },
      },
    ]);
    expect(createValueToTraverseFromPrefix(new ValuePath(['hello', 1, 'sir']), 0)).toEqual({
      hello: [undefined, { sir: 0 }],
    });
  });
});
