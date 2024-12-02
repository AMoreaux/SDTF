import { z } from 'zod';

import { childrenAndParentsUpToDepthOperatorSchema } from '../internals/childrenAndParentsUpToDepthOperator.js';
import { nodePropertiesMatchingSchema } from '../internals/nodePropertiesMatching.js';
import { NodeWithAtDepth, nodeWithAtDepthSchema } from '../internals/nodeAtDepthProperty.js';
import { WhereNode } from '../query.js';
import { CollectionWhere } from './collectionWhere.js';
import { TokenWhere } from './tokenWhere.js';

export const tokenChildrenOfGroupUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('group'), z.literal('collection')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const groupChildrenOfGroupUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('collection'), z.literal('token')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const collectionChildrenOfGroupUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('group'), z.literal('token')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const groupParentsOfGroupUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('collection')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const collectionParentsOfGroupUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('group')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const groupSelectSchema = z
  .object({
    group: z.boolean().optional(),
    children: z
      .union([
        z.literal(true),
        childrenAndParentsUpToDepthOperatorSchema,
        z
          .object({
            tokens: z
              .union([z.literal(true), tokenChildrenOfGroupUpToDepthOperatorSchema])
              .optional(),
            groups: z
              .union([z.literal(true), groupChildrenOfGroupUpToDepthOperatorSchema])
              .optional(),
            collections: z
              .union([z.literal(true), collectionChildrenOfGroupUpToDepthOperatorSchema])
              .optional(),
          })
          .strict(),
      ])
      .optional(),
    parents: z
      .union([
        z.literal(true),
        childrenAndParentsUpToDepthOperatorSchema,
        z
          .object({
            groups: z
              .union([z.literal(true), groupParentsOfGroupUpToDepthOperatorSchema])
              .optional(),
            collections: z
              .union([z.literal(true), collectionParentsOfGroupUpToDepthOperatorSchema])
              .optional(),
          })
          .strict(),
      ])
      .optional(),
  })
  .strict();
export type GroupSelect = z.infer<typeof groupSelectSchema>;
export const groupSelectPropertySchema = z.union([z.literal(true), groupSelectSchema]);
export type GroupSelectProperty = z.infer<typeof groupSelectPropertySchema>;
export const groupWithSelectSchema = z.object({
  select: groupSelectPropertySchema,
});
export type GroupWithSelect = z.infer<typeof groupWithSelectSchema>;
const groupNestedInPropertySchema = z.object({
  collection: z.boolean().optional(),
  group: z.boolean().optional(),
});
export type GroupNestedInProperty = z.infer<typeof groupNestedInPropertySchema>;
const groupWithNestedInSchema = z.object({
  nestedIn: groupNestedInPropertySchema.optional(),
});
export type GroupWithNestedIn = z.infer<typeof groupWithNestedInSchema>;
const groupWithSelfSelectorSchema = z.object({
  group: nodePropertiesMatchingSchema,
});
export type GroupWithSelfSelector = z.infer<typeof groupWithSelfSelectorSchema>;
export const groupWhereBaseSchema = groupWithSelfSelectorSchema
  .merge(nodeWithAtDepthSchema)
  .merge(groupWithNestedInSchema);
export type GroupAndWhereOperator =
  | GroupWhere
  | CollectionWhere
  | TokenWhere
  | Array<GroupWhere | CollectionWhere | TokenWhere>;
export type GroupWhereWithSelect = GroupWithSelfSelector &
  GroupWithNestedIn &
  NodeWithAtDepth &
  GroupWithSelect & {
    andWhere?: never;
  };
export type GroupWhereWithAndWhere = GroupWithSelfSelector &
  GroupWithNestedIn &
  NodeWithAtDepth & {
    andWhere: GroupAndWhereOperator;
    select?: never;
  };
export type GroupWhere = GroupWhereWithSelect | GroupWhereWithAndWhere;

export function matchIsGroupWhere(where: WhereNode): where is GroupWhere {
  return 'group' in where;
}

export function matchIsGroupWhereWithSelect(where: WhereNode): where is GroupWhereWithSelect {
  return 'select' in where && matchIsGroupWhere(where);
}

export function matchIsGroupWhereWithAndWhere(where: WhereNode): where is GroupWhereWithAndWhere {
  return 'andWhere' in where && matchIsGroupWhere(where);
}
