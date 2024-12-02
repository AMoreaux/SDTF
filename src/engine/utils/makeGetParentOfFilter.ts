import { TreePath } from '../state/path/TreePath.js';

export function makeGetParentOfFilter(targetPath: TreePath, depth: number = Infinity) {
  return function getParentsOfFilter(node: { path: TreePath }) {
    if (node.path.length >= targetPath.length) {
      return false;
    }

    if (node.path.toString() === targetPath.toString()) {
      return false;
    }

    if (!node.path.isRootOf(targetPath)) {
      return false;
    }

    const isSameRoot = node.path.isRootOf(targetPath);
    if (!isSameRoot) {
      return false;
    }

    const leftPartOfPath = targetPath.clone().removeRight(node.path.length);

    return leftPartOfPath.length <= depth;
  };
}
