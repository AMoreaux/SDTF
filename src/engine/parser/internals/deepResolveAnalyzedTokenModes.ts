import { TreeNodeSet } from '../../state/TreeNodeSet.js';

import { AnalyzedToken } from './parseRawToken.js';

export function deepResolveAnalyzedTokenModes(
  stringPath: string,
  analyzedTokens: TreeNodeSet<AnalyzedToken>,
): Array<string> | undefined {
  const token = analyzedTokens.getOne(stringPath);
  if (!token) {
    return;
  }
  if (token.modes) {
    return token.modes;
  }
  if (token.computedModes) {
    return token.computedModes;
  }
  const modes = deepResolveAnalyzedTokenModes(
    token.analyzedValueAliasParts[0].alias.path.toString(),
    analyzedTokens,
  );
  if (modes) {
    token.computedModes = modes;
  }

  return modes;
}
