import { makeGetChildrenOfFilter } from '../utils/makeGetChildrenOfFilter.js';
import { makeGetParentOfFilter } from '../utils/makeGetParentOfFilter.js';
import { TreePath } from './path/TreePath.js';

export class TreeNodeSet<
  Node extends {
    path: TreePath;
  },
> {
  readonly #nodes: Array<Node> = [];

  private static makeStringPath(path: TreePath | string) {
    return path.toString();
  }

  constructor(nodes?: Array<Node>) {
    if (nodes) {
      this.#nodes.push(...nodes);
    }
  }

  get all() {
    return this.#nodes;
  }

  get size() {
    return this.#nodes.length;
  }

  *[Symbol.iterator]() {
    const data = this.#nodes;
    for (let i = 0; i < data.length; i++) {
      yield data[i];
    }
  }

  public add(...nodes: Array<Node>) {
    this.#nodes.push(...nodes);
  }

  public delete(path: TreePath | string) {
    const targetStringPath = TreeNodeSet.makeStringPath(path);

    const index = this.#nodes.findIndex(node => node.path.toString() === targetStringPath);
    if (index === -1) {
      return false;
    }
    this.#nodes.splice(index, 1);
    return true;
  }

  public clear() {
    this.#nodes.length = 0;
  }

  public has(path: TreePath | string) {
    return this.#nodes.some(node => node.path.toString() === path.toString());
  }

  public getOne(path: TreePath | string) {
    const targetStringPath = TreeNodeSet.makeStringPath(path);

    return this.#nodes.find(node => node.path.toString() === targetStringPath);
  }

  public getChildrenOf(path: TreePath, depth = Infinity) {
    return this.#nodes.filter(makeGetChildrenOfFilter(path, depth));
  }

  public getParentsOf(path: TreePath, depth = Infinity) {
    return this.#nodes.filter(makeGetParentOfFilter(path, depth)).reverse().splice(0, depth);
  }
}
