import { TreePath } from '../../state/path/TreePath.js';

type NodeLike = { path: TreePath };

export function computeIsContinuousNodesGraph(nodesLike: Array<NodeLike>) {
  // We consider a graph being continuous if empty or with only one node
  if (nodesLike.length === 0 || nodesLike.length === 1) {
    return true;
  }

  const [nodesAtRootLevel, nodesAtOtherLevels] = nodesLike.reduce<
    [Array<NodeLike>, Array<NodeLike>]
  >(
    (acc, node) => {
      if (node.path.length === 1) {
        acc[0].push(node);
      } else {
        acc[1].push(node);
      }
      return acc;
    },
    [[], []],
  );

  if (nodesAtRootLevel.length > 0) {
    // Ensure no duplicated root level nodes
    const lengthCheck = new Set(nodesAtRootLevel.map(node => node.path.toString()));
    if (lengthCheck.size !== nodesAtRootLevel.length) {
      return false;
    }

    // Only root level nodes
    if (nodesAtRootLevel.length === nodesLike.length) {
      return true;
    }

    return (
      nodesAtOtherLevels
        // Sort by deepest path first
        .sort((a, b) => b.path.length - a.path.length)
        .every(node => {
          const parentPath = node.path.slice(0, -1);
          // Look for parent in all nodes
          return !!nodesLike.find(x => x.path.isEqual(parentPath));
        })
    );
  }

  // Identify the new root(s)
  const sortedByShallowerNodes = nodesAtOtherLevels.sort((a, b) => a.path.length - b.path.length);

  const newRootNode = sortedByShallowerNodes[0];
  const sortedByShallowerWithoutRootNodes = sortedByShallowerNodes.slice(1);

  const smallerPathLength = newRootNode.path.length;
  const hasMultipleRoots = sortedByShallowerWithoutRootNodes.some(
    node => node.path.length === smallerPathLength,
  );

  if (hasMultipleRoots) {
    return false;
  }

  return sortedByShallowerWithoutRootNodes // Sort by deepest path first
    .sort((a, b) => b.path.length - a.path.length)
    .every(node => {
      const parentPath = node.path.slice(0, -1);
      // Look for parent in all nodes
      return !!nodesLike.find(x => x.path.isEqual(parentPath));
    });
}
