import {
  getDesignTokenDefinition,
  SpecifyDesignTokenSignature,
  treeNodeNameSchema,
  validateSpecifyDesignTokenTypeName,
} from '../../../definitions/index.js';
import { specifyGenericDesignTokenSignatureSchema } from '../../../definitions/internals/designTokenSignature.js';
import { parseRawTokenValue } from './parseRawTokenValue.js';
import { AnalyzedSDTFNode } from './AnalyzedSDTFNode.js';
import { DesignTokenDefinition } from '../../../definitions/internals/createDesignTokenDefinition.js';
import {
  AnalyzedTokenValueAliasPart,
  AnalyzedTokenValuePrimitivePart,
} from './AnalyzedTokenValuePart.js';
import { TreePath } from '../../state/path/TreePath.js';

export type AnalyzedToken = AnalyzedSDTFNode &
  SpecifyDesignTokenSignature & {
    definition: DesignTokenDefinition<string>;
    isTopLevelAlias: boolean;
    modes: Array<string> | null;
    analyzedValueAliasParts: Array<AnalyzedTokenValueAliasPart>;
    analyzedValuePrimitiveParts: Array<AnalyzedTokenValuePrimitivePart>;
    computedModes?: Array<string>;
    isFullyResolvable?: boolean;
    modesResolvability?: Record<string, boolean>;
  };

export function parseRawToken(
  path: TreePath,
  rawToken: SpecifyDesignTokenSignature,
): AnalyzedToken {
  const {
    $type: typeCandidate,
    $value: valueCandidate,
    $description,
    $extensions,
  } = specifyGenericDesignTokenSignatureSchema.parse(rawToken, { path: path.toArray() });

  const extractedName = path.tail();
  const name = treeNodeNameSchema.parse(extractedName, { path: path.toArray() });

  const $type = validateSpecifyDesignTokenTypeName(typeCandidate);

  const definition = getDesignTokenDefinition($type);

  const { $value } = definition.aliasableTokenZodSchema
    .pick({ $value: true })
    .parse({ $value: valueCandidate });

  const { aliasParts, primitiveParts } = parseRawTokenValue($value, path);

  let isTopLevelAlias = false;
  if (aliasParts.length === 1 && aliasParts[0].type === 'topLevelAlias') {
    isTopLevelAlias = true;
  }

  let modes: Array<string> | null = null;
  if (!isTopLevelAlias) {
    // Compute local modes
    const modesSet = [...aliasParts, ...primitiveParts].reduce((acc, part) => {
      if (part.type !== 'topLevelAlias') {
        acc.add(part.localMode);
      }
      return acc;
    }, new Set<string>());
    modes = Array.from(modesSet);
  }

  return {
    path,
    name,
    $type,
    $value,
    $description,
    $extensions,
    definition,
    isTopLevelAlias,
    modes,
    analyzedValueAliasParts: aliasParts,
    analyzedValuePrimitiveParts: primitiveParts,
  };
}
