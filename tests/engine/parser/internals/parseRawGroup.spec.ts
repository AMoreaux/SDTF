import { describe, it, expect } from 'vitest';
import { parseRawGroup } from '../../../../src/engine/parser/internals/parseRawGroup.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('parseRawGroup', () => {
  it('should fail when the name contains the dot character', () => {
    expect(() => parseRawGroup(new TreePath(['a', 'an.invalid.name']), {})).toThrowError(`[
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
});
