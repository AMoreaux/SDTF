import { z } from 'zod';

import type { SDTFQuery } from '../query/index.js';
import type { SpecifyDesignToken } from '../../definitions/index.js';
import {
  treeNodeExtensionsSchema,
  treePathSchema,
} from '../../definitions/internals/designTokenTree.js';
import { specifyCollectionPropertiesSchema } from '../../definitions/internals/designTokenCollection.js';
import { specifyGroupPropertiesSchema } from '../../definitions/internals/designTokenGroup.js';
import { specifyAliasableDesignTokenSchema } from '../../definitions/designTokenDefinitions.js';
import { createMutationDefinition } from './createMutationDefinition.js';

export const resetTokenTreeMutationDefinition = createMutationDefinition({
  name: 'resetTokenTree',
  schema: z.void(),
});

export const loadTokenTreeMutationDefinition = createMutationDefinition({
  name: 'loadTokenTree',
  schema: z
    .object({
      tokens: z.unknown(),
    })
    .strict(),
});

export const renameNodeMutationDefinition = createMutationDefinition({
  name: 'renameCollection',
  schema: z
    .object({
      atPath: treePathSchema,
      name: z.string(),
    })
    .strict(),
});

/* ------------------------------------------
   Tree views
--------------------------------------------- */
export const registerViewMutationDefinition = createMutationDefinition({
  name: 'registerView',
  schema: z
    .object({
      name: z.string(),
      query: z.custom<SDTFQuery>(v => v),
      shouldSetActive: z.boolean().nullable(),
    })
    .strict(),
});

export const updateViewMutationDefinition = createMutationDefinition({
  name: 'updateView',
  schema: z
    .object({
      name: z.string(),
      query: z.custom<SDTFQuery>(v => v),
      shouldSetActive: z.boolean().nullable(),
    })
    .strict(),
});

export const setActiveViewMutationDefinition = createMutationDefinition({
  name: 'setActiveView',
  schema: z
    .object({
      name: z.string().nullable(),
    })
    .strict(),
});

export const deleteViewMutationDefinition = createMutationDefinition({
  name: 'deleteView',
  schema: z
    .object({
      name: z.string(),
    })
    .strict(),
});

export const deleteAllViewsMutationDefinition = createMutationDefinition({
  name: 'deleteAllViews',
  schema: z.void(),
});

/* ------------------------------------------
   Collection
--------------------------------------------- */
export const addCollectionMutationDefinition = createMutationDefinition({
  name: 'addCollection',
  schema: z
    .object({
      parentPath: treePathSchema,
      name: z.string(),
      collectionProperties: specifyCollectionPropertiesSchema,
    })
    .strict(),
});

export const renameCollectionMutationDefinition = createMutationDefinition({
  name: 'renameCollection',
  schema: z
    .object({
      atPath: treePathSchema,
      name: z.string(),
    })
    .strict(),
});

export const updateCollectionDescriptionMutationDefinition = createMutationDefinition({
  name: 'updateCollectionDescription',
  schema: z
    .object({
      atPath: treePathSchema,
      description: z.string(),
    })
    .strict(),
});

export const updateCollectionExtensionsMutationDefinition = createMutationDefinition({
  name: 'updateCollectionExtensions',
  schema: z
    .object({
      atPath: treePathSchema,
      extensions: treeNodeExtensionsSchema,
    })
    .strict(),
});

export const renameCollectionModeMutationDefinition = createMutationDefinition({
  name: 'renameCollectionMode',
  schema: z
    .object({
      atPath: treePathSchema,
      fromMode: z.string(),
      toMode: z.string(),
    })
    .strict(),
});

export const truncateCollectionMutationDefinition = createMutationDefinition({
  name: 'truncateCollection',
  schema: z
    .object({
      atPath: treePathSchema,
    })
    .strict(),
});

export const deleteCollectionMutationDefinition = createMutationDefinition({
  name: 'deleteCollection',
  schema: z
    .object({
      atPath: treePathSchema,
    })
    .strict(),
});

export const deleteCollectionModeMutationDefinition = createMutationDefinition({
  name: 'deleteCollectionMode',
  schema: z
    .object({
      atPath: treePathSchema,
      mode: z.string(),
    })
    .strict(),
});

export const moveCollectionMutationDefinition = createMutationDefinition({
  name: 'moveCollection',
  schema: z
    .object({
      atPath: treePathSchema,
      toPath: treePathSchema,
    })
    .strict(),
});

/* ------------------------------------------
   Group
--------------------------------------------- */
export const addGroupMutationDefinition = createMutationDefinition({
  name: 'addGroup',
  schema: z
    .object({
      parentPath: treePathSchema,
      name: z.string(),
      groupProperties: specifyGroupPropertiesSchema,
    })
    .strict(),
});

export const renameGroupMutationDefinition = createMutationDefinition({
  name: 'renameGroup',
  schema: z
    .object({
      atPath: treePathSchema,
      name: z.string(),
    })
    .strict(),
});

export const updateGroupDescriptionMutationDefinition = createMutationDefinition({
  name: 'updateGroupDescription',
  schema: z
    .object({
      atPath: treePathSchema,
      description: z.string(),
    })
    .strict(),
});

export const updateGroupExtensionsMutationDefinition = createMutationDefinition({
  name: 'updateGroupExtensions',
  schema: z
    .object({
      atPath: treePathSchema,
      extensions: treeNodeExtensionsSchema,
    })
    .strict(),
});

export const truncateGroupMutationDefinition = createMutationDefinition({
  name: 'truncateGroup',
  schema: z
    .object({
      atPath: treePathSchema,
    })
    .strict(),
});

export const deleteGroupMutationDefinition = createMutationDefinition({
  name: 'deleteGroup',
  schema: z
    .object({
      atPath: treePathSchema,
    })
    .strict(),
});

export const moveGroupMutationDefinition = createMutationDefinition({
  name: 'moveGroup',
  schema: z
    .object({
      atPath: treePathSchema,
      toPath: treePathSchema,
    })
    .strict(),
});

/* ------------------------------------------
   Token
--------------------------------------------- */
export const addTokenMutationDefinition = createMutationDefinition({
  name: 'addToken',
  schema: z
    .object({
      parentPath: treePathSchema,
      name: z.string(),
      tokenProperties: specifyAliasableDesignTokenSchema as z.Schema<SpecifyDesignToken>,
    })
    .strict(),
});

export const renameTokenMutationDefinition = createMutationDefinition({
  name: 'renameToken',
  schema: z
    .object({
      atPath: treePathSchema,
      name: z.string(),
    })
    .strict(),
});

export const updateTokenDescriptionMutationDefinition = createMutationDefinition({
  name: 'updateTokenDescription',
  schema: z
    .object({
      atPath: treePathSchema,
      description: z.string(),
    })
    .strict(),
});

export const updateTokenExtensionsMutationDefinition = createMutationDefinition({
  name: 'updateTokenExtensions',
  schema: z
    .object({
      atPath: treePathSchema,
      extensions: treeNodeExtensionsSchema,
    })
    .strict(),
});

export const updateTokenValueMutationDefinition = createMutationDefinition({
  name: 'updateTokenValue',
  schema: z
    .object({
      atPath: treePathSchema,
      // We cannot know with type of the value since no type is enforced
      value: z.unknown(),
    })
    .strict(),
});

export const resolveTokenValueAliasesMutationDefinition = createMutationDefinition({
  name: 'resolveTokenValueAliases',
  schema: z
    .object({
      atPath: treePathSchema,
    })
    .strict(),
});

export const updateTokenModeValueMutationDefinition = createMutationDefinition({
  name: 'updateTokenModeValue',
  schema: z.object({
    atPath: treePathSchema,
    mode: z.string(),
    // We cannot know with type of the value since no type is enforced
    value: z.unknown(),
  }),
});

export const renameTokenModeMutationDefinition = createMutationDefinition({
  name: 'renameTokenMode',
  schema: z
    .object({
      atPath: treePathSchema,
      fromMode: z.string(),
      toMode: z.string(),
    })
    .strict(),
});

export const createTokenModeValueMutationDefinition = createMutationDefinition({
  name: 'createTokenModeValue',
  schema: z
    .object({
      atPath: treePathSchema,
      mode: z.string(),
      // We cannot know with type of the value since no type is enforced
      value: z.unknown(),
    })
    .strict(),
});

export const deleteTokenModeValueMutationDefinition = createMutationDefinition({
  name: 'deleteTokenModeValue',
  schema: z
    .object({
      atPath: treePathSchema,
      mode: z.string(),
    })
    .strict(),
});

export const deleteTokenMutationDefinition = createMutationDefinition({
  name: 'deleteToken',
  schema: z
    .object({
      atPath: treePathSchema,
    })
    .strict(),
});

export const moveTokenMutationDefinition = createMutationDefinition({
  name: 'moveToken',
  schema: z
    .object({
      atPath: treePathSchema,
      toPath: treePathSchema,
    })
    .strict(),
});
