import { ValuePath } from '../../state/path/ValuePath.js';
import { AnalyzedToken } from './parseRawToken.js';
import { TreeNodeSet } from '../../state/TreeNodeSet.js';
import { SDTFError } from '../../../errors/index.js';
import { deepResolveAnalyzedTokenModes } from './deepResolveAnalyzedTokenModes.js';
import { pickInObject } from '../../utils/pickInObject.js';
import { AnalyzedTokenValueAliasPart } from './AnalyzedTokenValuePart.js';

export function analyzeValueAliasPart(
  analyzedToken: AnalyzedToken,
  aliasPart: AnalyzedTokenValueAliasPart,
  treeNodeSet: TreeNodeSet<AnalyzedToken>,
) {
  if (aliasPart.type === 'topLevelAlias' && aliasPart.alias.path.isEqual(analyzedToken.path)) {
    throw new SDTFError(
      'SDTF_CIRCULAR_ALIAS_REFERENCE_FOUND',
      `Alias "${aliasPart.alias.path}" on token "${analyzedToken.path}" is referencing itself.`,
    );
  } else if (
    (aliasPart.type === 'modeLevelAlias' || aliasPart.type === 'valueLevelAlias') &&
    aliasPart.alias.path.isEqual(analyzedToken.path) &&
    aliasPart.alias.targetMode === aliasPart.localMode
  ) {
    throw new SDTFError(
      'SDTF_CIRCULAR_ALIAS_REFERENCE_FOUND',
      `Alias "${aliasPart.alias.path}" on token "${analyzedToken.path}" is referencing itself in mode "${aliasPart.localMode}".`,
    );
  }

  // Try to resolve the alias reference
  const referencedToken = treeNodeSet.getOne(aliasPart.alias.path.toString());

  // Compute resolution status
  let isResolvable = !!referencedToken;

  // Perform modes and type pairing checks
  if (referencedToken) {
    let referencedTokenModes: Array<string> | undefined;

    if (referencedToken.modes) {
      referencedTokenModes = referencedToken.modes;
    } else if (referencedToken.computedModes) {
      referencedTokenModes = referencedToken.computedModes;
    } else {
      referencedTokenModes = deepResolveAnalyzedTokenModes(
        referencedToken.analyzedValueAliasParts[0].alias.path.toString(),
        treeNodeSet,
      );
    }

    switch (aliasPart.type) {
      case 'topLevelAlias': {
        if (!analyzedToken.computedModes) {
          analyzedToken.computedModes = referencedTokenModes;
        }
        const matchResult = analyzedToken.definition.matchTokenTypeAgainstMapping(
          referencedToken.$type,
          ValuePath.empty(),
          _discriminatorKeyPath => {
            /* v8 ignore next 5 */
            throw new SDTFError(
              'SDTF_INTERNAL_DESIGN_ERROR',
              'Discriminator key path should not be triggered on top level aliases',
            );
          },
        );
        if (!matchResult.success) {
          throw new SDTFError(
            'SDTF_INVALID_ALIAS_TYPE_REFERENCED',
            `Alias "${referencedToken.path}" on token "${analyzedToken.path}" is of type "${referencedToken.$type}" but should be of type "${matchResult.expectedType}"`,
          );
        }
        break;
      }
      case 'modeLevelAlias':
      case 'valueLevelAlias': {
        // Alias is resolvable when the targetMode exists in the referenced token
        isResolvable =
          referencedTokenModes !== undefined &&
          referencedTokenModes.includes(aliasPart.alias.targetMode);
        if (isResolvable) {
          const matchResult = analyzedToken.definition.matchTokenTypeAgainstMapping(
            referencedToken.$type,
            (aliasPart as any).valuePath ?? ValuePath.empty(),
            discriminatorKeyPath => {
              const computedPath = [aliasPart.localMode, ...discriminatorKeyPath];
              return pickInObject(analyzedToken.$value as object, computedPath);
            },
          );
          if (!matchResult.success) {
            throw new SDTFError(
              'SDTF_INVALID_ALIAS_TYPE_REFERENCED',
              `Alias "${referencedToken.path}" on token "${analyzedToken.path}" is of type "${referencedToken.$type}" but should be of type "${matchResult.expectedType}"`,
            );
          }
        }

        break;
      }
    }
  }

  return isResolvable;
}
