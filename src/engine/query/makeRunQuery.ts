import { TreeState, ViewSelectorOptions } from '../state/TreeState.js';
import {
  matchIsCollectionWhere,
  matchIsCollectionWhereWithAndWhere,
  matchIsCollectionWhereWithSelect,
  matchIsGroupWhere,
  matchIsGroupWhereWithAndWhere,
  matchIsGroupWhereWithSelect,
  matchIsTokenWhere,
  parseQuery,
  SDTFQuery,
  WhereNode,
} from './index.js';
import { makeTokenWithContainsAliasesFilter } from './filters/makeTokenWithContainsAliasesFilter.js';
import { makeTokenWithCreatedFilter } from './filters/makeTokenWithCreatedFilter.js';
import { makeTokenWithSourceIdsFilter } from './filters/makeTokenWithSourceIdsFilter.js';
import { makeTokenWithUpdatedFilter } from './filters/makeTokenWithUpdatedFilter.js';
import { makeMaybeNodePropertiesRegexes } from './internals/nodePropertiesMatching.js';
import { GroupState } from '../state/GroupState.js';
import { CollectionState } from '../state/CollectionState.js';
import { TokenState } from '../state/TokenState.js';
import { QueryResult } from './internals/QueryResult.js';
import { makeNodePropertiesFilter } from './filters/makeNodePropertiesFilter.js';
import { makeTokenWithTypesFilter } from './filters/makeTokenWithTypesFilter.js';
import { makeTokenWithModesFilter } from './filters/makeTokenWithModesFilter.js';
import { makeCollectionWithModesFilter } from './filters/makeCollectionWithModesFilter.js';
import { makePreviousMatchesWithChildrenFilter } from './filters/makePreviousMatchesWithChildrenFilter.js';
import { QueryContext } from './internals/QueryContext.js';

const viewOptions: ViewSelectorOptions = {
  withView: null,
};

function traverseQuery(
  treeState: TreeState,
  whereNodeOrMany: WhereNode | Array<WhereNode>,
  ctx: QueryContext,
  previousMatches?: Array<GroupState | CollectionState>,
) {
  if (Array.isArray(whereNodeOrMany)) {
    whereNodeOrMany.forEach(whereNode => traverseQuery(treeState, whereNode, ctx, previousMatches));
    return;
  }

  // Match nodes
  let matchedNodeStates: Array<GroupState | CollectionState | TokenState> = [];
  if (matchIsTokenWhere(whereNodeOrMany)) {
    const {
      token,
      atDepth,
      nestedIn,
      withTypes,
      withModes,
      containsAliases,
      withSourceIds,
      created,
      updated,
    } = whereNodeOrMany;

    if (atDepth !== undefined) throw new Error('Token where.atDepth is not implemented');
    if (nestedIn !== undefined) throw new Error('Token where.nestedIn is not implemented');

    const filterPreviousMatchesWithChildren =
      makePreviousMatchesWithChildrenFilter(previousMatches);
    const filterNodeProperties = makeNodePropertiesFilter(makeMaybeNodePropertiesRegexes(token));
    const filterTokenWithTypes = makeTokenWithTypesFilter(withTypes);
    const filterTokenWithModes = makeTokenWithModesFilter(withModes);
    const filterTokenWithContainsAliases = makeTokenWithContainsAliasesFilter(containsAliases);
    const filterTokenWithSourceIds = makeTokenWithSourceIdsFilter(withSourceIds);
    const filterTokenWithCreated = makeTokenWithCreatedFilter(created);
    const filterTokenWithUpdated = makeTokenWithUpdatedFilter(updated);

    matchedNodeStates = treeState
      .getAllTokenStates(viewOptions)
      .filter(
        tokenState =>
          filterPreviousMatchesWithChildren(tokenState) &&
          filterNodeProperties(tokenState) &&
          filterTokenWithTypes(tokenState) &&
          filterTokenWithModes(tokenState) &&
          filterTokenWithContainsAliases(tokenState) &&
          filterTokenWithSourceIds(tokenState) &&
          filterTokenWithCreated(tokenState) &&
          filterTokenWithUpdated(tokenState),
      );
  } else if (matchIsGroupWhere(whereNodeOrMany)) {
    const { group, atDepth, nestedIn } = whereNodeOrMany;

    if (atDepth !== undefined) throw new Error('Group where.atDepth is not implemented');
    if (nestedIn !== undefined) throw new Error('Group where.nestedIn is not implemented');

    matchedNodeStates = treeState
      .getAllGroupStates(viewOptions)
      .filter(
        groupState =>
          makePreviousMatchesWithChildrenFilter(previousMatches)(groupState) &&
          makeNodePropertiesFilter(makeMaybeNodePropertiesRegexes(group))(groupState),
      );

    if (matchIsGroupWhereWithAndWhere(whereNodeOrMany)) {
      const { andWhere } = whereNodeOrMany;
      traverseQuery(treeState, andWhere, ctx, matchedNodeStates as Array<GroupState>);
    }
  } else if (matchIsCollectionWhere(whereNodeOrMany)) {
    const { collection, atDepth, nestedIn, withModes } = whereNodeOrMany;

    if (atDepth !== undefined) throw new Error('Collection where.atDepth is not implemented');
    if (nestedIn !== undefined) throw new Error('Collection where.nestedIn is not implemented');

    matchedNodeStates = treeState
      .getAllCollectionStates(viewOptions)
      .filter(
        collectionState =>
          makePreviousMatchesWithChildrenFilter(previousMatches) &&
          makeNodePropertiesFilter(makeMaybeNodePropertiesRegexes(collection))(collectionState) &&
          makeCollectionWithModesFilter(withModes)(collectionState),
      );

    if (matchIsCollectionWhereWithAndWhere(whereNodeOrMany)) {
      traverseQuery(
        treeState,
        whereNodeOrMany.andWhere,
        ctx,
        matchedNodeStates as Array<CollectionState>,
      );
    }
  } else {
    throw new Error(`Unexpected where node ${JSON.stringify(whereNodeOrMany)}`);
  }

  // Select and add nodes to ctx.finalNodes
  if (matchIsTokenWhere(whereNodeOrMany)) {
    const { select } = whereNodeOrMany;
    if (select === true) {
      matchedNodeStates.forEach(node => ctx.add(node));
    } else {
      const { token, parents } = select;

      const shouldSelectToken = token !== false;
      if (shouldSelectToken) {
        matchedNodeStates.forEach(node => ctx.add(node));
      }

      if (parents === undefined) {
        // do nothing
      } else if (parents === true) {
        matchedNodeStates.forEach(node => {
          treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
            ctx.add(parent);
          });
        });
      } else if ('groups' in parents || 'collections' in parents) {
        const { groups, collections } = parents;

        // Parent Groups
        if (groups === undefined) {
          // Do nothing
        } else if (groups === true) {
          matchedNodeStates.forEach(node => {
            treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof GroupState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in groups) {
          const { upToDepth } = groups;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getParentsOf(node.path, upToDepth, viewOptions).forEach(parent => {
                if (parent instanceof GroupState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error('Token select.parents.groups.upToDepth as string is not implemented');
          }
        } else if ('equalToDepth' in groups) {
          throw new Error('Token select.parents.groups.equalToDepth is not implemented');
        }

        // Parent Collections
        if (collections === undefined) {
          // Do nothing
        } else if (collections === true) {
          matchedNodeStates.forEach(node => {
            treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof CollectionState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in collections) {
          const { upToDepth } = collections;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getParentsOf(node.path, upToDepth, viewOptions).filter(parent => {
                if (parent instanceof CollectionState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error(
              'Token select.parents.collections.upToDepth as string is not implemented',
            );
          }
        } else if ('equalToDepth' in collections) {
          throw new Error('Token select.parents.collections.equalToDepth is not implemented');
        }
      } else if ('upToDepth' in parents) {
        matchedNodeStates.forEach(node => {
          treeState.getParentsOf(node.path, parents.upToDepth, viewOptions).forEach(parent => {
            ctx.add(parent);
          });
        });
      } else if ('equalToDepth' in parents) {
        throw new Error('Token select.parents.equalToDepth is not implemented');
      } else {
        throw new Error(`Unexpected parents: ${JSON.stringify(parents)}`);
      }
    }
  } else if (matchIsGroupWhereWithSelect(whereNodeOrMany)) {
    const { select } = whereNodeOrMany;

    if (select === true) {
      matchedNodeStates.forEach(node => ctx.add(node));
    } else {
      const { group, parents, children } = select;

      const shouldSelectGroup = group !== false;
      if (shouldSelectGroup) {
        matchedNodeStates.forEach(node => ctx.add(node));
      }

      // Select children
      if (children === undefined) {
        // do nothing
      } else if (children === true) {
        matchedNodeStates.forEach(node => {
          treeState
            .getChildrenOf(node.path, undefined, viewOptions)
            .forEach(child => ctx.add(child));
        });
      } else if ('collections' in children || 'groups' in children || 'tokens' in children) {
        const { collections, groups, tokens } = children;

        // Token children
        if (tokens === undefined) {
          // do nothing
        } else if (tokens === true) {
          matchedNodeStates.forEach(node => {
            treeState.getChildrenOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof TokenState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in tokens) {
          const { upToDepth } = tokens;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getChildrenOf(node.path, upToDepth, viewOptions).forEach(parent => {
                if (parent instanceof TokenState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error('Group select.children.tokens.upToDepth as string is not implemented');
          }
        } else if ('equalToDepth' in tokens) {
          throw new Error('Group select.children.tokens.equalToDepth is not implemented');
        }

        // Group children
        if (groups === undefined) {
          // do nothing
        } else if (groups === true) {
          matchedNodeStates.forEach(node => {
            treeState.getChildrenOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof GroupState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in groups) {
          const { upToDepth } = groups;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getChildrenOf(node.path, upToDepth, viewOptions).forEach(parent => {
                if (parent instanceof GroupState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error('Group select.children.groups.upToDepth as string is not implemented');
          }
        } else if ('equalToDepth' in groups) {
          throw new Error('Group select.children.groups.equalToDepth is not implemented');
        }

        // Collection children
        if (collections === undefined) {
          // do nothing
        } else if (collections === true) {
          matchedNodeStates.forEach(node => {
            treeState.getChildrenOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof CollectionState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in collections) {
          const { upToDepth } = collections;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState
                .getChildrenOf(node.path, upToDepth, viewOptions)
                .filter(parent => parent instanceof CollectionState)
                .forEach(child => {
                  ctx.add(child);
                });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error(
              'Group select.children.collections.upToDepth as string is not implemented',
            );
          }
        } else if ('equalToDepth' in collections) {
          throw new Error('Group select.children.collections.equalToDepth is not implemented');
        }
      } else if ('upToDepth' in children) {
        matchedNodeStates.forEach(node => {
          treeState.getChildrenOf(node.path, children.upToDepth, viewOptions).forEach(child => {
            ctx.add(child);
          });
        });
      } else if ('equalToDepth' in children) {
        throw new Error('Group select.children.equalToDepth is not implemented');
      }

      // Select parents
      if (parents === undefined) {
        // do nothing
      } else if (parents === true) {
        matchedNodeStates.forEach(node => {
          treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
            ctx.add(parent);
          });
        });
      } else if ('groups' in parents || 'collections' in parents) {
        const { groups, collections } = parents;

        // Parent Groups
        if (groups === undefined) {
          // Do nothing
        } else if (groups === true) {
          matchedNodeStates.forEach(node => {
            treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof GroupState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in groups) {
          const { upToDepth } = groups;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getParentsOf(node.path, upToDepth, viewOptions).forEach(parent => {
                if (parent instanceof GroupState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error('Group select.parents.groups.upToDepth as string is not implemented');
          }
        } else if ('equalToDepth' in groups) {
          throw new Error('Group select.parents.groups.equalToDepth is not implemented');
        }

        // Parent Collections
        if (collections === undefined) {
          // Do nothing
        } else if (collections === true) {
          matchedNodeStates.forEach(node => {
            treeState
              .getParentsOf(node.path, undefined, viewOptions)
              .filter(parent => parent instanceof CollectionState)
              .forEach(parent => {
                ctx.add(parent);
              });
          });
        } else if ('upToDepth' in collections) {
          const { upToDepth } = collections;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState
                .getParentsOf(node.path, upToDepth, viewOptions)
                .filter(parent => parent instanceof CollectionState)
                .forEach(parent => {
                  ctx.add(parent);
                });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error(
              'Group select.parents.collections.upToDepth as string is not implemented',
            );
          }
        } else if ('equalToDepth' in collections) {
          throw new Error('Group select.parents.collections.equalToDepth is not implemented');
        }
      } else if ('upToDepth' in parents) {
        matchedNodeStates.forEach(node => {
          treeState.getParentsOf(node.path, parents.upToDepth, viewOptions).forEach(parent => {
            ctx.add(parent);
          });
        });
      } else if ('equalToDepth' in parents) {
        throw new Error('Group select.parents.equalToDepth is not implemented');
      }
    }
  } else if (matchIsCollectionWhereWithSelect(whereNodeOrMany)) {
    const { select } = whereNodeOrMany;

    if (select === true) {
      matchedNodeStates.forEach(node => ctx.add(node));
    } else {
      const { collection, parents, children } = select;

      const shouldSelectCollection = collection !== false;
      if (shouldSelectCollection) {
        matchedNodeStates.forEach(node => ctx.add(node));
      }

      // Select children
      if (children === undefined) {
        // do nothing
      } else if (children === true) {
        matchedNodeStates.forEach(node => {
          treeState
            .getChildrenOf(node.path, undefined, viewOptions)
            .forEach(child => ctx.add(child));
        });
      } else if ('groups' in children || 'tokens' in children) {
        const { groups, tokens } = children;

        // Token children
        if (tokens === undefined) {
          // do nothing
        } else if (tokens === true) {
          matchedNodeStates.forEach(node => {
            treeState.getChildrenOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof TokenState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in tokens) {
          const { upToDepth } = tokens;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getChildrenOf(node.path, upToDepth, viewOptions).forEach(parent => {
                if (parent instanceof TokenState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error(
              'Collection select.children.tokens.upToDepth as string is not implemented',
            );
          }
        } else if ('equalToDepth' in tokens) {
          throw new Error('Collection select.children.tokens.equalToDepth is not implemented');
        }

        // Group children
        if (groups === undefined) {
          // do nothing
        } else if (groups === true) {
          matchedNodeStates.forEach(node => {
            treeState.getChildrenOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof GroupState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in groups) {
          const { upToDepth } = groups;
          if (typeof upToDepth === 'number') {
            matchedNodeStates.forEach(node => {
              treeState.getChildrenOf(node.path, upToDepth, viewOptions).forEach(parent => {
                if (parent instanceof GroupState) {
                  ctx.add(parent);
                }
              });
            });
          } else if (typeof upToDepth === 'string') {
            throw new Error(
              'Collection select.children.groups.upToDepth as string is not implemented',
            );
          }
        } else if ('equalToDepth' in groups) {
          throw new Error('Collection select.children.groups.equalToDepth is not implemented');
        }
      } else if ('upToDepth' in children) {
        matchedNodeStates.forEach(node => {
          treeState.getChildrenOf(node.path, children.upToDepth, viewOptions).forEach(child => {
            ctx.add(child);
          });
        });
      } else if ('equalToDepth' in children) {
        throw new Error('Collection select.children.equalToDepth is not implemented');
      }

      // Select parents
      if (parents === undefined) {
        // do nothing
      } else if (parents === true) {
        matchedNodeStates.forEach(node => {
          treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
            ctx.add(parent);
          });
        });
      } else if ('groups' in parents) {
        const { groups } = parents;

        // Parent Groups
        if (groups === undefined) {
          // Do nothing
        } else if (groups === true) {
          matchedNodeStates.forEach(node => {
            treeState.getParentsOf(node.path, undefined, viewOptions).forEach(parent => {
              if (parent instanceof GroupState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('upToDepth' in groups) {
          const { upToDepth } = groups;
          matchedNodeStates.forEach(node => {
            treeState.getParentsOf(node.path, upToDepth, viewOptions).forEach(parent => {
              if (parent instanceof GroupState) {
                ctx.add(parent);
              }
            });
          });
        } else if ('equalToDepth' in groups) {
          throw new Error('Collection select.parents.groups.equalToDepth is not implemented');
        }
      } else if ('upToDepth' in parents) {
        matchedNodeStates.forEach(node => {
          treeState.getParentsOf(node.path, parents.upToDepth, viewOptions).forEach(parent => {
            ctx.add(parent);
          });
        });
      } else if ('equalToDepth' in parents) {
        throw new Error('Collection select.parents.equalToDepth is not implemented');
      }
    }
  }
}

export function makeRunQuery(treeState: TreeState) {
  return function runQuery(query: SDTFQuery) {
    const { where } = parseQuery(query);

    const queryContext = new QueryContext();

    traverseQuery(treeState, where, queryContext);

    return new QueryResult(queryContext, treeState);
  };
}
