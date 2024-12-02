import { SpecifyDesignTokenValueWithMode } from '../../../definitions/internals/designTokenSignature.js';
import { traverseJSONValue } from '../../../utils/traverseJSONValue.js';
import { JSONValue } from '../../../utils/JSONDefinitions.js';
import {
  matchIsModeAndValueLevelAliasSignature,
  matchIsTopLevelAliasSignature,
  specifyDesignTokenValueModeSchema,
} from '../../../definitions/index.js';
import { SDTFError } from '../../../errors/index.js';
import { ValuePath } from '../../state/path/ValuePath.js';
import {
  AnalyzedTokenValueAliasPart,
  AnalyzedTokenValuePrimitivePart,
} from './AnalyzedTokenValuePart.js';
import { TreePath } from '../../state/path/TreePath.js';

export function traverseRawTokenModeValue(
  localMode: string,
  modeValue: SpecifyDesignTokenValueWithMode<unknown, string, false>,
  path: TreePath,
): {
  aliasParts: Array<AnalyzedTokenValueAliasPart>;
  primitiveParts: Array<AnalyzedTokenValuePrimitivePart>;
} {
  const parsedLocalMode = specifyDesignTokenValueModeSchema.parse(localMode, {
    path: [...path.toArray(), '$value', localMode],
  });
  const aliasParts: Array<AnalyzedTokenValueAliasPart> = [];
  const primitiveParts: Array<AnalyzedTokenValuePrimitivePart> = [];

  traverseJSONValue(modeValue as JSONValue, (value, path) => {
    if (matchIsModeAndValueLevelAliasSignature(value)) {
      // Distinguish between mode and value level alias
      if (path.length === 0) {
        aliasParts.push({
          type: 'modeLevelAlias',
          localMode: parsedLocalMode,
          alias: {
            path: TreePath.fromString(value.$alias),
            targetMode: value.$mode,
          },
        });
      } else {
        aliasParts.push({
          type: 'valueLevelAlias',
          localMode: parsedLocalMode,
          valuePath: new ValuePath(path),
          alias: {
            path: TreePath.fromString(value.$alias),
            targetMode: value.$mode,
          },
        });
      }

      return false;
    }

    // If data is non-empty array or object, we continue traversing
    if (
      value !== null &&
      ((Array.isArray(value) && value.length > 0) ||
        (typeof value === 'object' && Object.keys(value).length > 0))
    ) {
      return true;
    }

    // Otherwise, we record the primitive value
    primitiveParts.push({
      type: 'primitive',
      localMode: parsedLocalMode,
      valuePath: new ValuePath(path),
      value,
    });

    return false;
  });

  return {
    aliasParts,
    primitiveParts,
  };
}

export function parseRawTokenValue(
  value: SpecifyDesignTokenValueWithMode,
  path: TreePath = TreePath.empty(),
): {
  aliasParts: Array<AnalyzedTokenValueAliasPart>;
  primitiveParts: Array<AnalyzedTokenValuePrimitivePart>;
} {
  if (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    '$alias' in value &&
    '$mode' in value
  ) {
    throw new SDTFError(
      'SDTF_TOKEN_INVALID_MODE',
      `Cannot get value of token "${value.$alias}" with mode "${value.$mode}" - Top level aliases cannot have a $mode.`,
    );
  }
  if (matchIsTopLevelAliasSignature(value)) {
    return {
      aliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: TreePath.fromString(value.$alias),
          },
        },
      ],
      primitiveParts: [],
    };
  }
  return Object.entries(value)
    .map(([localMode, modeValue]) => traverseRawTokenModeValue(localMode, modeValue, path))
    .reduce(
      (acc, { aliasParts, primitiveParts }) => {
        aliasParts.forEach(aliasPart => acc.aliasParts.push(aliasPart));
        primitiveParts.forEach(primitivePart => acc.primitiveParts.push(primitivePart));
        return acc;
      },
      { aliasParts: [], primitiveParts: [] },
    );
}
