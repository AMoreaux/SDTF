import { z } from 'zod';
import { validateDesignTokenTreeRootNode } from '../../definitions/internals/designTokenTree.js';
import { SDTFError } from '../../errors/index.js';
import { JSONParseIfString } from '../utils/JSONParseIfString.js';
import { JSONObject } from '../../utils/JSONDefinitions.js';
import { TreeNodeSet } from '../state/TreeNodeSet.js';
import { traverseTokenTree } from './internals/traverseTokenTree.js';
import { AnalyzedToken, parseRawToken } from './internals/parseRawToken.js';
import { AnalyzedCollection, parseRawCollection } from './internals/parseRawCollection.js';
import { AnalyzedGroup, parseRawGroup } from './internals/parseRawGroup.js';
import { computeDeepModesResolvability } from './internals/computeDeepModesResolvability.js';
import { analyzeValueAliasPart } from './internals/analyzeValueAliasPart.js';
import { checkForTokenModesInCollection } from './internals/checkForTokenModesInCollection.js';
import { TreePath } from '../state/path/TreePath.js';

export type AnalyzedTokenTree = {
  analyzedTokens: TreeNodeSet<AnalyzedToken>;
  analyzedCollections: TreeNodeSet<AnalyzedCollection>;
  analyzedGroups: TreeNodeSet<AnalyzedGroup>;
};

export function analyzeTokenTree(tokenTree: unknown = {}): AnalyzedTokenTree {
  try {
    tokenTree = JSONParseIfString(tokenTree);
  } catch (error) {
    throw new SDTFError(
      'SDTF_INVALID_TOKEN_TREE_INPUT',
      'Failed to parse tokenTree from JSON string input.',
    );
  }

  try {
    const shallowParsed = validateDesignTokenTreeRootNode(tokenTree) as JSONObject;

    const analyzedTokens = new TreeNodeSet<AnalyzedToken>();
    const analyzedCollections = new TreeNodeSet<AnalyzedCollection>();
    const analyzedGroups = new TreeNodeSet<AnalyzedGroup>();

    traverseTokenTree(shallowParsed, {
      onToken: (path, token) => {
        // We validate at runtime that the array is only an array of string
        analyzedTokens.add(parseRawToken(new TreePath(path as Array<string>), token));
      },
      onCollection: (path, collectionProperties) => {
        analyzedCollections.add(
          // We validate at runtime that the array is only an array of string
          parseRawCollection(new TreePath(path as Array<string>), collectionProperties),
        );
      },
      onGroup: (path, groupProperties) => {
        // We validate at runtime that the array is only an array of string
        analyzedGroups.add(parseRawGroup(new TreePath(path as Array<string>), groupProperties));
      },
    });

    /* ------------------------------------------
       Tokens
    --------------------------------------------- */
    try {
      // Resolve alias references
      analyzedTokens.all.forEach(localToken => {
        localToken.analyzedValueAliasParts.forEach(aliasPart => {
          // Set the alias resolution status
          aliasPart.isResolvable = analyzeValueAliasPart(localToken, aliasPart, analyzedTokens);
        });
      });

      // Compute aliases resolvability
      analyzedTokens.all.forEach(localToken => {
        computeDeepModesResolvability(localToken.path.toString(), analyzedTokens);
      });
    } catch (error) {
      // TODO @Nico: improve for circular alias references
      if (error instanceof RangeError) {
        throw new SDTFError(
          'SDTF_CIRCULAR_ALIAS_REFERENCE_FOUND',
          `A circular alias reference was found in initial token tree.`,
        );
      }
      throw error;
    }

    /* ------------------------------------------
       Collections
    --------------------------------------------- */
    // Check for tokens modes in collections
    analyzedCollections.all.forEach(collection => {
      analyzedTokens.getChildrenOf(collection.path).forEach(token => {
        const tokenModes = token.computedModes ?? token.modes;
        checkForTokenModesInCollection(
          token.path.toString(),
          tokenModes,
          collection.path.toString(),
          collection.allowedModes,
        );
      });
    });

    // Check for nested collection by looking at the parents of each collection
    analyzedCollections.all.forEach(collection => {
      analyzedCollections.getParentsOf(collection.path).forEach(parentCollection => {
        throw new SDTFError(
          'SDTF_NESTED_COLLECTION',
          `Collection "${collection.path}" is nested in collection "${parentCollection.path}".`,
        );
      });
    });

    return {
      analyzedTokens,
      analyzedCollections,
      analyzedGroups,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.reduce<Array<string>>((acc, issue) => {
        const atPath = issue.path.length > 0 ? ` at path "${issue.path.join('.')}"` : '';
        acc.push(`(${issue.code})${atPath}: ${issue.message}`);
        return acc;
      }, []);
      throw new SDTFError(
        'SDTF_INVALID_TOKEN_TREE_INPUT',
        `Validation error ${messages.join(', ')}`,
      );
    }
    throw error;
  }
}
