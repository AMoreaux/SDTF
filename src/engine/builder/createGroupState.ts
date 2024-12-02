import { TreeState } from '../state/TreeState.js';
import { AnalyzedGroup } from '../parser/internals/parseRawGroup.js';
import { GroupState } from '../state/GroupState.js';

export function createGroupState(treeState: TreeState, analyzedGroup: AnalyzedGroup) {
  return new GroupState(treeState, {
    path: analyzedGroup.path,
    name: analyzedGroup.name,
    $description: analyzedGroup.$description,
    $extensions: analyzedGroup.$extensions,
  });
}
