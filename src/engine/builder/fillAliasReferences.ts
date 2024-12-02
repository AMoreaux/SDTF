import { AnalyzedToken } from '../parser/internals/parseRawToken.js';
import { ValuePath } from '../state/path/ValuePath.js';
import { TokenState } from '../state/TokenState.js';
import { AliasReferenceSet } from '../state/AliasReferenceSet.js';

export function fillAliasReferences(
  analyzedToken: AnalyzedToken,
  tokenState: TokenState,
  aliasReferences: AliasReferenceSet,
  findTokenState: (stringPath: string) => TokenState,
) {
  analyzedToken.analyzedValueAliasParts.forEach(aliasPart => {
    let localMode: string | null;
    let valuePath: ValuePath;
    let targetMode: string | null;

    switch (aliasPart.type) {
      case 'topLevelAlias': {
        valuePath = ValuePath.empty();
        localMode = null;
        targetMode = null;
        break;
      }
      case 'modeLevelAlias': {
        valuePath = ValuePath.empty();
        localMode = aliasPart.localMode;
        targetMode = aliasPart.alias.targetMode;
        break;
      }
      case 'valueLevelAlias': {
        valuePath = aliasPart.valuePath.clone();
        localMode = aliasPart.localMode;
        targetMode = aliasPart.alias.targetMode;
        break;
      }
    }

    if (aliasPart.isResolvable) {
      const targetTokenState = findTokenState(aliasPart.alias.path.toString());

      aliasReferences.add({
        from: {
          treePath: tokenState.path,
          valuePath,
          mode: localMode,
        },
        to: {
          treePath: targetTokenState.path,
          mode: targetMode,
        },
        isResolvable: true,
      });
    } else {
      aliasReferences.add({
        from: {
          treePath: tokenState.path,
          valuePath,
          mode: localMode,
        },
        to: {
          treePath: aliasPart.alias.path.clone(),
          mode: targetMode,
        },
        isResolvable: false,
        reason: `Token "${aliasPart.alias.path}" does not exist`,
      });
    }
  });
}
