import { expect } from 'vitest';
import { ValuePath } from '../src/engine/state/path/ValuePath.js';
import { TreePath } from '../src/engine/state/path/TreePath.js';

function areTreePathEquals(a: unknown, b: unknown) {
  const isATreePath = a instanceof TreePath;
  const isBTreePath = b instanceof TreePath;

  if (isATreePath && isBTreePath) {
    return a.isEqual(b);
  }

  if (isATreePath === isBTreePath) {
    return undefined;
  }

  return false;
}

function areValuePathEquals(a: unknown, b: unknown) {
  const isATreePath = a instanceof ValuePath;
  const isBTreePath = b instanceof ValuePath;

  if (isATreePath && isBTreePath) {
    return a.isEqual(b);
  }

  if (isATreePath === isBTreePath) {
    return undefined;
  }

  return false;
}

expect.addEqualityTesters([areTreePathEquals, areValuePathEquals]);
