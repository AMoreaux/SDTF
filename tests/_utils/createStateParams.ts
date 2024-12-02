import { ValuePath } from '../../src/engine/state/path/ValuePath.js';
import { TreeNodeStateParams } from '../../src/engine/state/TreeNodeState.js';
import { getDesignTokenDefinition, SpecifyDesignTokenTypeName } from '../../src/index.js';
import { GroupStateParams } from '../../src/engine/state/GroupState.js';
import { TreeNodeExtensions } from '../../src/definitions/internals/designTokenTree.js';
import { CollectionStateParams } from '../../src/engine/state/CollectionState.js';
import { TokenStateParams } from '../../src/engine/state/TokenState.js';
import { AnalyzedTokenValuePrimitivePart } from '../../src/engine/parser/internals/AnalyzedTokenValuePart.js';
import { TreePath } from '../../src/engine/state/path/TreePath.js';

export function createTreeNodeStateParams(
  path: TreePath,
  extra: {
    $description?: string;
    $extensions?: TreeNodeExtensions;
  } = {},
): TreeNodeStateParams {
  const name = path.tail();

  return {
    path,
    name,
    $description: extra.$description,
    $extensions: extra.$extensions,
  };
}

export function createGroupStateParams(
  path: TreePath,
  extra: {
    $description?: string;
    $extensions?: TreeNodeExtensions;
  } = {},
): GroupStateParams {
  return {
    ...createTreeNodeStateParams(path, extra),
  };
}

export function createCollectionStateParams(
  path: TreePath,
  allowedModes: Array<string> = ['default'],
  extra: {
    $description?: string;
    $extensions?: TreeNodeExtensions;
  } = {},
): CollectionStateParams {
  return {
    ...createTreeNodeStateParams(path, extra),
    allowedModes,
  };
}

export function createTokenStateParams(
  path: TreePath,
  {
    type,
    $description,
    $extensions,
    isTopLevelAlias,
    primitiveParts,
    isFullyResolvable,
    modesResolvability,
  }: {
    type: SpecifyDesignTokenTypeName;
    isTopLevelAlias: boolean;
    primitiveParts: Array<
      Partial<AnalyzedTokenValuePrimitivePart> & Pick<AnalyzedTokenValuePrimitivePart, 'value'>
    >;
    isFullyResolvable: boolean;
    modesResolvability: Array<[string, boolean]>;
    $description?: string;
    $extensions?: TreeNodeExtensions;
  },
): TokenStateParams {
  return {
    ...createTreeNodeStateParams(path, { $description, $extensions }),
    // Token data
    $type: type,
    // Analyzed data
    definition: getDesignTokenDefinition(type),
    isTopLevelAlias,
    analyzedValuePrimitiveParts: primitiveParts.map(part => ({
      type: 'primitive',
      localMode: 'default',
      valuePath: ValuePath.empty(),
      ...part,
    })),
    // Post process data
    isFullyResolvable,
    modesResolvabilityMap: new Map(modesResolvability),
  };
}
