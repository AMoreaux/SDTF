import { describe, it, expect } from 'vitest';

import { computeIsContinuousNodesGraph } from '../../../../src/engine/query/internals/computeIsContinuousNodesGraph.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('computeIsContinuousNodesGraph', () => {
  it('should return true when the nodes array is empty', () => {
    expect(computeIsContinuousNodesGraph([])).toBe(true);
  });
  it('should return true when the nodes array has only one element with a path of length 1', () => {
    expect(computeIsContinuousNodesGraph([{ path: new TreePath(['a']) }])).toBe(true);
  });
  it('should return true when the nodes array has only one element with a path of length 2', () => {
    expect(computeIsContinuousNodesGraph([{ path: new TreePath(['a', 'b']) }])).toBe(true);
  });
  it('should return true when the nodes are all root', () => {
    expect(
      computeIsContinuousNodesGraph([{ path: new TreePath(['a']) }, { path: new TreePath(['b']) }]),
    ).toBe(true);
  });
  it('should return true when the some nodes are root with children nodes', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a']) },
        { path: new TreePath(['a', 'c']) },
        { path: new TreePath(['a', 'c', 'd']) },
        { path: new TreePath(['b']) },
      ]),
    ).toBe(true);
  });
  it('should return true when the nodes are part of the same branch starting at root', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a']) },
        { path: new TreePath(['a', 'b']) },
      ]),
    ).toBe(true);
  });
  it('should return true when the nodes are part of the same branch nested', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b']) },
        { path: new TreePath(['a', 'b', 'c']) },
      ]),
    ).toBe(true);
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b', 'c']) },
        { path: new TreePath(['a', 'b', 'c', 'd']) },
      ]),
    ).toBe(true);
  });
  it('should return false when the nodes are part of different branches starting at root', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b']) },
        { path: new TreePath(['c', 'd']) },
      ]),
    ).toBe(false);
  });
  it('should return false when the nodes are part of different branches nested', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b', 'c']) },
        { path: new TreePath(['a', 'd', 'e']) },
      ]),
    ).toBe(false);
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b', 'c']) },
        { path: new TreePath(['a', 'b', 'c', 'd']) },
        { path: new TreePath(['a', 'd', 'e']) },
      ]),
    ).toBe(false);
  });
  it('should return false when the nodes are part of the same root branch nested but skip entries', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a']) },
        { path: new TreePath(['a', 'b']) },
        // missing a.c
        { path: new TreePath(['a', 'c', 'd']) },
      ]),
    ).toBe(false);
  });
  it('should return false when the nodes are part of the same non-root branch nested but skip entries', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b']) },
        { path: new TreePath(['a', 'b', 'a', 'a']) },
      ]),
    ).toBe(false);
  });
  it('EDGE CASE :: should return false when containing twice the same node', () => {
    expect(
      computeIsContinuousNodesGraph([
        { path: new TreePath(['a', 'b', 'c']) },
        { path: new TreePath(['a', 'b', 'c']) },
      ]),
    ).toBe(false);
    expect(
      computeIsContinuousNodesGraph([{ path: new TreePath(['a']) }, { path: new TreePath(['a']) }]),
    ).toBe(false);
  });
});
