import { TreeState } from '../state/TreeState.js';
import { AnalyzedCollection } from '../parser/internals/parseRawCollection.js';
import { CollectionState } from '../state/CollectionState.js';

export function createCollectionState(
  treeState: TreeState,
  analyzedCollection: AnalyzedCollection,
) {
  return new CollectionState(treeState, {
    path: analyzedCollection.path,
    name: analyzedCollection.name,
    $description: analyzedCollection.$description,
    $extensions: analyzedCollection.$extensions,
    allowedModes: analyzedCollection.allowedModes,
  });
}
