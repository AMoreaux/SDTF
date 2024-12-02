import { describe, it, expect } from 'vitest';
import { parseRawToken } from '../../../../src/engine/parser/internals/parseRawToken.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('parseRawToken', () => {
  it('should fail when the name contains the dot character', () => {
    expect(() =>
      parseRawToken(new TreePath(['a', 'an.invalid.name']), {
        $type: 'string',
        $value: { default: 'value' },
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
});
