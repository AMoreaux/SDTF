import { describe, it, expect } from 'vitest';
import { parseRawCollection } from '../../../../src/engine/parser/internals/parseRawCollection.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('parseRawCollection', () => {
  it('should fail when the name contains the dot character', () => {
    expect(() =>
      parseRawCollection(new TreePath(['a', 'an.invalid.name']), {
        $collection: { $modes: ['a', 'b'] },
      }),
    ).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain the '.' (dot) character.",
    "path": [
      "a",
      "an.invalid.name"
    ]
  }
]`);
  });
  it('should fail when a name of mode is empty', () => {
    expect(() =>
      parseRawCollection(new TreePath(['a', 'b']), {
        $collection: { $modes: ['a', ''] },
      }),
    ).toThrowError(`[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "$mode must be a non-empty string",
    "path": [
      "a",
      "b",
      "$collection",
      "$modes",
      1
    ]
  }
]`);
  });
  it('should fail when a name of mode starts with $', () => {
    expect(() =>
      parseRawCollection(new TreePath(['a', 'b']), {
        $collection: { $modes: ['a', '$b'] },
      }),
    ).toThrowError(`[
  {
    "code": "custom",
    "message": "$mode cannot start with a \\"$\\"",
    "path": [
      "a",
      "b",
      "$collection",
      "$modes",
      1
    ]
  }
]`);
  });
});
