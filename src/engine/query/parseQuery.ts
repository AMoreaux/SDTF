import { z } from 'zod';
import {
  CollectionAndWhereOperator,
  collectionSelectPropertySchema,
  collectionWhereBaseSchema,
} from './definitions/collectionWhere.js';
import { groupSelectPropertySchema, groupWhereBaseSchema } from './definitions/groupWhere.js';
import { tokenWhereSchema } from './definitions/tokenWhere.js';

import {
  shallowQuerySchema,
  shallowWhereWithSelectOrAndWhereSchema,
} from './internals/shallowSchemas.js';
import { SDTFQuery, WhereNode } from './query.js';
import { SDTFError } from '../../errors/index.js';

function parseWhere(
  whereCandidate: unknown | Array<unknown>,
  currentPath: Array<string | number>,
): WhereNode | Array<WhereNode> {
  if (typeof whereCandidate !== 'object' || whereCandidate === null) {
    throw new z.ZodError([
      {
        message: 'Where must be an object or an array',
        path: [],
        code: z.ZodIssueCode.invalid_type,
        expected: 'object',
        received: typeof whereCandidate,
      },
    ]);
  }

  if (Array.isArray(whereCandidate)) {
    return whereCandidate.map((c, i) => parseWhere(c, currentPath.concat(i))) as
      | WhereNode
      | Array<WhereNode>;
  }

  const { select, andWhere } = shallowWhereWithSelectOrAndWhereSchema.parse(whereCandidate);

  if ('group' in whereCandidate) {
    const groupWhereBase = groupWhereBaseSchema.parse(whereCandidate);

    if (select !== undefined) {
      return {
        ...groupWhereBase,
        select: groupSelectPropertySchema.parse(select),
      };
    }
    return {
      ...groupWhereBase,
      andWhere: parseWhere(andWhere, currentPath.concat('group')),
    };
  }
  if ('collection' in whereCandidate) {
    if (currentPath.includes('collection')) {
      throw new z.ZodError([
        {
          message: 'Collection where operator cannot be nested in Collection',
          path: currentPath,
          code: z.ZodIssueCode.invalid_type,
          expected: 'object',
          received: typeof whereCandidate,
        },
      ]);
    }

    const collectionWhereBase = collectionWhereBaseSchema.parse(whereCandidate);

    if (select !== undefined) {
      return {
        ...collectionWhereBase,
        select: collectionSelectPropertySchema.parse(select),
      };
    }
    return {
      ...collectionWhereBase,
      andWhere: parseWhere(
        andWhere,
        currentPath.concat('collection'),
      ) as CollectionAndWhereOperator,
    };
  }
  if ('token' in whereCandidate) {
    return tokenWhereSchema.parse(whereCandidate);
  }

  throw new SDTFError('SDTF_INTERNAL_DESIGN_ERROR', 'Unknown where type in SDTF query');
}

export function parseQuery(queryCandidate: unknown): SDTFQuery {
  const parsed = shallowQuerySchema.parse(queryCandidate);

  return {
    where: parseWhere(parsed.where, []),
  };
}
