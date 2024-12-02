import { GroupState } from '../../state/GroupState.js';
import { CollectionState } from '../../state/CollectionState.js';
import { TokenState } from '../../state/TokenState.js';

export class QueryContext {
  #finalNodes: Set<GroupState | CollectionState | TokenState> = new Set();
  #nodeTypes: Set<'group' | 'collection' | 'token'> = new Set();

  add(node: GroupState | CollectionState | TokenState) {
    if (node instanceof GroupState) {
      this.#nodeTypes.add('group');
    } else if (node instanceof CollectionState) {
      this.#nodeTypes.add('collection');
    } else if (node instanceof TokenState) {
      this.#nodeTypes.add('token');
    }
    this.#finalNodes.add(node);
    return this;
  }

  get nodeStates() {
    return Array.from(this.#finalNodes);
  }

  get nodeTypesSet() {
    return this.#nodeTypes;
  }
}
