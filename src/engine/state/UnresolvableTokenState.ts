import { TreeNodeState } from './TreeNodeState.js';
import { TreePath } from './path/TreePath.js';
import { TreeState } from './TreeState.js';

/**
 * @deprecated
 */
export class UnresolvableTokenState extends TreeNodeState {
  reason: string;

  constructor(treeState: TreeState, path: TreePath, reason: string) {
    super(treeState, {
      name: path.tail(),
      path,
      $description: undefined,
      $extensions: undefined,
    });
    this.reason = reason;
  }

  public getCommonJSON() {
    return {
      $alias: this.path.toString(),
    };
  }
  public toJSON() {
    return null;
  }
}
