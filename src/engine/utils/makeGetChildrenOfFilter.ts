import { TreePath } from '../state/path/TreePath.js';

export function makeGetChildrenOfFilter(targetPath: TreePath, depth: number = Infinity) {
  const targetStringPath = targetPath.toString();

  return function getChildrenOfFilter(node: { path: TreePath }) {
    if (node.path.length <= targetPath.length) {
      return false;
    }

    if (node.path.toString() === targetStringPath) {
      return false;
    }

    if (!node.path.toString().startsWith(targetStringPath)) {
      return false;
    }

    const hasSameRoot = targetPath.isRootOf(node.path);

    if (!hasSameRoot) {
      return false;
    }

    const rightPartOfPath = node.path.clone().removeLeft(targetPath.length);

    return rightPartOfPath.length <= depth;
  };
}
