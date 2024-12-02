import { TreeNodeSet } from './TreeNodeSet.js';
import { TokenState } from './TokenState.js';
import { GroupState } from './GroupState.js';
import { CollectionState } from './CollectionState.js';
import { AnalyzedTokenTree } from '../parser/analyzeTokenTree.js';

export class TreeNodesState {
  readonly tokens = new TreeNodeSet<TokenState>();
  readonly groups = new TreeNodeSet<GroupState>();
  readonly collections = new TreeNodeSet<CollectionState>();

  clear() {
    this.tokens.clear();
    this.groups.clear();
    this.collections.clear();
  }

  toStateParams() {
    return {
      tokens: this.tokens.all.map(n => n.toTokenStateParams()),
      groups: this.groups.all.map(n => n.toGroupStateParams()),
      collections: this.collections.all.map(n => n.toCollectionStateParams()),
    };
  }

  toAnalyzedTokenTree(): AnalyzedTokenTree {
    return {
      analyzedTokens: new TreeNodeSet(this.tokens.all.map(n => n.toAnalyzedToken())),
      analyzedGroups: new TreeNodeSet(this.groups.all.map(n => n.toAnalyzedGroup())),
      analyzedCollections: new TreeNodeSet(this.collections.all.map(n => n.toAnalyzedCollection())),
    };
  }
}
