import { TreeNodeSet } from '../../state/TreeNodeSet.js';
import { AnalyzedToken } from './parseRawToken.js';

export function computeDeepModesResolvability(
  tokenStringPath: string,
  analyzedTokens: TreeNodeSet<AnalyzedToken>,
) {
  const analyzedToken = analyzedTokens.getOne(tokenStringPath);
  if (!analyzedToken) {
    return undefined;
  }

  if (analyzedToken.modesResolvability !== undefined) {
    return analyzedToken.modesResolvability;
  }

  const modesResolvability: { [mode: string]: boolean } = {};

  // Set the modesResolvability to true for all the modes containing primitives
  analyzedToken.analyzedValuePrimitiveParts.forEach(part => {
    if (!Reflect.has(modesResolvability, part.localMode)) {
      Reflect.set(modesResolvability, part.localMode, true);
    }
  });

  // Compute the modesResolvability for all the modes containing aliases
  analyzedToken.analyzedValueAliasParts.forEach(part => {
    switch (part.type) {
      case 'topLevelAlias': {
        const resolvability = computeDeepModesResolvability(
          part.alias.path.toString(),
          analyzedTokens,
        );
        if (resolvability !== undefined) {
          Object.assign(modesResolvability, resolvability);
        }
        break;
      }
      case 'modeLevelAlias':
      case 'valueLevelAlias': {
        const deepResolvability = computeDeepModesResolvability(
          part.alias.path.toString(),
          analyzedTokens,
        );

        const deepModeResolvability =
          Reflect.get(deepResolvability ?? {}, part.alias.targetMode) ?? false;
        const maybeModeResolvability = Reflect.get(modesResolvability, part.localMode);

        Reflect.set(
          modesResolvability,
          part.localMode,
          (maybeModeResolvability ?? true) && deepModeResolvability,
        );
        break;
      }
    }
  });

  analyzedToken.modesResolvability = modesResolvability;
  analyzedToken.isFullyResolvable =
    Object.values(modesResolvability).length > 0 &&
    Object.values(modesResolvability).every(v => v === true);

  return modesResolvability;
}
