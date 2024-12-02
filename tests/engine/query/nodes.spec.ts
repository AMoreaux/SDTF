import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  collectionWhereBaseSchema,
  groupWhereBaseSchema,
  tokenChildrenOfGroupUpToDepthOperatorSchema,
  groupChildrenOfGroupUpToDepthOperatorSchema,
  groupParentsOfGroupUpToDepthOperatorSchema,
  collectionParentsOfGroupUpToDepthOperatorSchema,
  tokenChildrenOfCollectionUpToDepthOperatorSchema,
  groupChildrenOfCollectionUpToDepthOperatorSchema,
  groupParentsOfTokenUpToDepthOperatorSchema,
  collectionParentsOfTokenUpToDepthOperatorSchema,
  groupSelectSchema,
  collectionSelectSchema,
  tokenSelectSchema,
  matchIsGroupWhere,
  matchIsGroupWhereWithSelect,
  matchIsGroupWhereWithAndWhere,
  GroupWhereWithSelect,
  GroupWhereWithAndWhere,
  matchIsCollectionWhere,
  CollectionWhereWithSelect,
  matchIsCollectionWhereWithSelect,
  CollectionWhereWithAndWhere,
  matchIsCollectionWhereWithAndWhere,
  TokenWhere,
  matchIsTokenWhere,
} from '../../../src/engine/query/index.js';
import { childrenAndParentsUpToDepthOperatorSchema } from '../../../src/engine/query/internals/childrenAndParentsUpToDepthOperator.js';

describe.concurrent('childrenAndParentsUpToDepthOperatorSchema', () => {
  it('should accept an object with upToDepth property', () => {
    const input = { upToDepth: 5 };
    const result = childrenAndParentsUpToDepthOperatorSchema.safeParse(input);
    expect(result.success).toBe(true);
    expect((result as any).data).toEqual(input);
  });
  it('should accept an object with equalToDepth property', () => {
    const input = { equalToDepth: 3 };
    const result = childrenAndParentsUpToDepthOperatorSchema.safeParse(input);
    expect(result.success).toBe(true);
    expect((result as any).data).toEqual(input);
  });
  it('should reject an object with both upToDepth and equalToDepth properties', () => {
    const input = { upToDepth: 5, equalToDepth: 3 };
    const result = childrenAndParentsUpToDepthOperatorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
  it('should reject an object with neither upToDepth nor equalToDepth properties', () => {
    const input = {};
    const result = childrenAndParentsUpToDepthOperatorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
  it('should reject an object with a non-numeric upToDepth property', () => {
    const input = { upToDepth: '5' };
    const result = childrenAndParentsUpToDepthOperatorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
  it('should reject an object with a non-numeric equalToDepth property', () => {
    const input = { equalToDepth: '3' };
    const result = childrenAndParentsUpToDepthOperatorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe.concurrent('Group', () => {
  describe.concurrent('tokenChildrenOfGroupUpToDepthOperatorSchema', () => {
    it('should accept an object with upToDepth property set to a number', () => {
      const input = { upToDepth: 5 };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should accept an object with upToDepth property set to "group"', () => {
      const input = { upToDepth: 'group' };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should accept an object with upToDepth property set to "collection"', () => {
      const input = { upToDepth: 'collection' };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should accept an object with equalToDepth property set to a number', () => {
      const input = { equalToDepth: 3 };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should reject an object with both upToDepth and equalToDepth properties', () => {
      const input = { upToDepth: 5, equalToDepth: 3 };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
    it('should reject an object with neither upToDepth nor equalToDepth properties', () => {
      const input = {};
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
    it('should reject an object with an invalid upToDepth property', () => {
      const input = { upToDepth: 'invalid' };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
    it('should reject an object with a non-numeric equalToDepth property', () => {
      const input = { equalToDepth: 'invalid' };
      const result = tokenChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
  describe.concurrent('groupChildrenOfGroupUpToDepthOperatorSchema', () => {
    it('should accept an object with upToDepth property set to a number', () => {
      const input = { upToDepth: 5 };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should accept an object with upToDepth property set to "collection"', () => {
      const input = { upToDepth: 'collection' };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should accept an object with upToDepth property set to "token"', () => {
      const input = { upToDepth: 'token' };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should accept an object with equalToDepth property set to a number', () => {
      const input = { equalToDepth: 3 };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(input);
    });
    it('should reject an object with both upToDepth and equalToDepth properties', () => {
      const input = { upToDepth: 5, equalToDepth: 3 };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
    it('should reject an object with neither upToDepth nor equalToDepth properties', () => {
      const input = {};
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
    it('should reject an object with an invalid upToDepth property', () => {
      const input = { upToDepth: 'invalid' };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
    it('should reject an object with a non-numeric equalToDepth property', () => {
      const input = { equalToDepth: 'invalid' };
      const result = groupChildrenOfGroupUpToDepthOperatorSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
  describe.concurrent('groupParentsOfGroupUpToDepthOperatorSchema', () => {
    it('should accept valid input with upToDepth as number', () => {
      const validInput = { upToDepth: 1 };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with upToDepth as collection', () => {
      const validInput = { upToDepth: 'collection' };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with equalToDepth', () => {
      const validInput = { equalToDepth: 1 };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with upToDepth as negative number', () => {
      const invalidInput = { upToDepth: -1 };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with upToDepth as string', () => {
      const invalidInput = { upToDepth: 'invalid' };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as negative number', () => {
      const invalidInput = { equalToDepth: -1 };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as string', () => {
      const invalidInput = { equalToDepth: 'invalid' };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with both upToDepth and equalToDepth', () => {
      const invalidInput = { upToDepth: 'collection', equalToDepth: 1 };
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with neither upToDepth nor equalToDepth', () => {
      const invalidInput = {};
      const result = groupParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
  describe.concurrent('collectionParentsOfGroupUpToDepthOperatorSchema', () => {
    it('should accept valid input with upToDepth as number', () => {
      const validInput = { upToDepth: 1 };
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with upToDepth as group', () => {
      const validInput = { upToDepth: 'group' };
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with equalToDepth', () => {
      const validInput = { equalToDepth: 1 };
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with upToDepth as negative number', () => {
      const invalidInput = { upToDepth: -1 };
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as negative number', () => {
      const invalidInput = { equalToDepth: -1 };
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with both upToDepth and equalToDepth', () => {
      const invalidInput = { upToDepth: 'group', equalToDepth: 1 };
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with neither upToDepth nor equalToDepth', () => {
      const invalidInput = {};
      const result = collectionParentsOfGroupUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('groupSelectSchema', () => {
    it('should accept valid input with group and children', () => {
      const validInput = { group: true, children: true };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and childrenAndParentsUpToDepthOperatorSchema', () => {
      const validInput = { group: true, children: { upToDepth: 1 }, parents: { equalToDepth: 2 } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and children.tokens', () => {
      const validInput = { group: true, children: { tokens: true } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and children.tokens.tokenChildrenOfGroupUpToDepthOperatorSchema', () => {
      const validInput = {
        group: true,
        children: { tokens: { upToDepth: 'collection' } },
        parents: { groups: { equalToDepth: 1 } },
      };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and children.groups', () => {
      const validInput = { group: true, children: { groups: true } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and children.groups.groupChildrenOfGroupUpToDepthOperatorSchema', () => {
      const validInput = {
        group: true,
        children: { groups: { upToDepth: 'collection' } },
        parents: { collections: { equalToDepth: 1 } },
      };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and children.collections', () => {
      const validInput = { group: true, children: { collections: true } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with group and children.collections.collectionChildrenOfGroupUpToDepthOperatorSchema', () => {
      const validInput = {
        group: true,
        children: { collections: { upToDepth: 'group' } },
        parents: { groups: { equalToDepth: 2 } },
      };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents', () => {
      const validInput = { parents: true };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and childrenAndParentsUpToDepthOperatorSchema', () => {
      const validInput = { parents: { upToDepth: 1 }, children: { equalToDepth: 1 } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and groups', () => {
      const validInput = { parents: { groups: true } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and groups.groupParentsOfGroupUpToDepthOperatorSchema', () => {
      const validInput = {
        parents: { groups: { upToDepth: 'collection' } },
        children: { tokens: true },
      };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and collections', () => {
      const validInput = { parents: { collections: true } };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and collections.collectionParentsOfGroupUpToDepthOperatorSchema', () => {
      const validInput = {
        parents: { collections: { equalToDepth: 1 } },
        children: { groups: true },
      };
      const result = groupSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with invalid children', () => {
      const invalidInput = { group: true, children: { invalid: true } };
      const result = groupSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with invalid parents', () => {
      const invalidInput = { group: true, parents: { invalid: true } };
      const result = groupSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('matchIsGroupWhere', () => {
    it('should accept valid input with group', () => {
      const validInput = { group: 'a group' };
      const result = matchIsGroupWhere(
        // @ts-expect-error
        validInput,
      );
      expect(result).toBe(true);
    });
    it('should reject invalid input without group', () => {
      const invalidInput = { invalid: true };
      const result = matchIsGroupWhere(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsGroupWhereWithSelect', () => {
    it('should accept valid input with group and select', () => {
      const validInput: GroupWhereWithSelect = { group: 'a group', select: { parents: true } };
      const result = matchIsGroupWhereWithSelect(validInput);
      expect(result).toBe(true);
    });
    it('should reject invalid input without group', () => {
      const invalidInput = { invalid: true };
      const result = matchIsGroupWhereWithSelect(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsGroupWhereWithAndWhere', () => {
    it('should accept valid input with group and andWhere', () => {
      const validInput: GroupWhereWithAndWhere = {
        group: 'a group',
        andWhere: { token: '.*', select: true },
      };
      const result = matchIsGroupWhereWithAndWhere(validInput);
      expect(result).toBe(true);
    });
    it('should reject invalid input without group', () => {
      const invalidInput = { invalid: true };
      const result = matchIsGroupWhereWithAndWhere(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
});

describe.concurrent('Collection', () => {
  describe.concurrent('tokenChildrenOfCollectionUpToDepthOperatorSchema', () => {
    it('should accept valid input with upToDepth as number', () => {
      const validInput = { upToDepth: 1 };
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with upToDepth as group', () => {
      const validInput = { upToDepth: 'group' };
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with equalToDepth', () => {
      const validInput = { equalToDepth: 1 };
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with upToDepth as negative number', () => {
      const invalidInput = { upToDepth: -1 };
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as negative number', () => {
      const invalidInput = { equalToDepth: -1 };
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with both upToDepth and equalToDepth', () => {
      const invalidInput = { upToDepth: 'group', equalToDepth: 1 };
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with neither upToDepth nor equalToDepth', () => {
      const invalidInput = {};
      const result = tokenChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
  describe.concurrent('groupChildrenOfCollectionUpToDepthOperatorSchema', () => {
    it('should accept valid input with upToDepth as number', () => {
      const validInput = { upToDepth: 1 };
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with upToDepth as token', () => {
      const validInput = { upToDepth: 'token' };
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with equalToDepth', () => {
      const validInput = { equalToDepth: 1 };
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with upToDepth as negative number', () => {
      const invalidInput = { upToDepth: -1 };
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as negative number', () => {
      const invalidInput = { equalToDepth: -1 };
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with both upToDepth and equalToDepth', () => {
      const invalidInput = { upToDepth: 'token', equalToDepth: 1 };
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with neither upToDepth nor equalToDepth', () => {
      const invalidInput = {};
      const result = groupChildrenOfCollectionUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('collectionSelectSchema', () => {
    it('should accept valid input with collection', () => {
      const validInput = { collection: true };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with collection and children', () => {
      const validInput = { collection: true, children: true };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with collection and childrenAndParentsUpToDepthOperatorSchema', () => {
      const validInput = {
        collection: true,
        children: { upToDepth: 1 },
        parents: { equalToDepth: 2 },
      };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with collection and children.tokens', () => {
      const validInput = { collection: true, children: { tokens: true } };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with collection and children.tokens.tokenChildrenOfCollectionUpToDepthOperatorSchema', () => {
      const validInput = {
        collection: true,
        children: { tokens: { upToDepth: 'group' } },
        parents: { groups: { equalToDepth: 1 } },
      };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with collection and children.groups', () => {
      const validInput = { collection: true, children: { groups: true } };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with collection and children.groups.groupChildrenOfCollectionUpToDepthOperatorSchema', () => {
      const validInput = {
        collection: true,
        children: { groups: { upToDepth: 'token' } },
        parents: { groups: { equalToDepth: 1 } },
      };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents', () => {
      const validInput = { parents: true };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and childrenAndParentsUpToDepthOperatorSchema', () => {
      const validInput = { parents: { upToDepth: 1 }, children: { equalToDepth: 1 } };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and groups', () => {
      const validInput = { parents: { groups: true } };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and groups.groupParentsOfCollectionUpToDepthOperatorSchema', () => {
      const validInput = {
        parents: { groups: { upToDepth: 1 } },
        children: { tokens: true },
      };
      const result = collectionSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with invalid children', () => {
      const invalidInput = { collection: true, children: { invalid: true } };
      const result = collectionSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with invalid parents', () => {
      const invalidInput = { parents: { invalid: true } };
      const result = collectionSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('matchIsCollectionWhere', () => {
    it('should accept valid input with collection', () => {
      const validInput = { collection: 'a collection' };
      const result = matchIsCollectionWhere(
        // @ts-expect-error
        validInput,
      );
      expect(result).toBe(true);
    });
    it('should reject invalid input without collection', () => {
      const invalidInput = { invalid: true };
      const result = matchIsCollectionWhere(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsCollectionWhereWithSelect', () => {
    it('should accept valid input with collection and select', () => {
      const validInput: CollectionWhereWithSelect = {
        collection: 'a collection',
        select: { children: true },
      };
      const result = matchIsCollectionWhereWithSelect(validInput);
      expect(result).toBe(true);
    });
    it('should reject invalid input without collection', () => {
      const invalidInput = { invalid: true };
      const result = matchIsCollectionWhereWithSelect(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsCollectionWhereWithAndWhere', () => {
    it('should accept valid input with collection and andWhere', () => {
      const validInput: CollectionWhereWithAndWhere = {
        collection: 'a collection',
        andWhere: { token: '.*', select: true },
      };
      const result = matchIsCollectionWhereWithAndWhere(validInput);
      expect(result).toBe(true);
    });
    it('should reject invalid input without collection', () => {
      const invalidInput = { invalid: true };
      const result = matchIsCollectionWhereWithAndWhere(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
});

describe.concurrent('Token', () => {
  describe.concurrent('groupParentsOfTokenUpToDepthOperatorSchema', () => {
    it('should accept valid input with upToDepth as number', () => {
      const validInput = { upToDepth: 1 };
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with upToDepth as collection', () => {
      const validInput = { upToDepth: 'collection' };
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with equalToDepth', () => {
      const validInput = { equalToDepth: 1 };
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with upToDepth as negative number', () => {
      const invalidInput = { upToDepth: -1 };
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as negative number', () => {
      const invalidInput = { equalToDepth: -1 };
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with both upToDepth and equalToDepth', () => {
      const invalidInput = { upToDepth: 'collection', equalToDepth: 1 };
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with neither upToDepth nor equalToDepth', () => {
      const invalidInput = {};
      const result = groupParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
  describe('collectionParentsOfTokenUpToDepthOperatorSchema', () => {
    it('should accept valid input with upToDepth as number', () => {
      const validInput = { upToDepth: 1 };
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with upToDepth as group', () => {
      const validInput = { upToDepth: 'group' };
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with equalToDepth', () => {
      const validInput = { equalToDepth: 1 };
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with upToDepth as negative number', () => {
      const invalidInput = { upToDepth: -1 };
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with equalToDepth as negative number', () => {
      const invalidInput = { equalToDepth: -1 };
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with both upToDepth and equalToDepth', () => {
      const invalidInput = { upToDepth: 'group', equalToDepth: 1 };
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with neither upToDepth nor equalToDepth', () => {
      const invalidInput = {};
      const result = collectionParentsOfTokenUpToDepthOperatorSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('tokenSelectSchema', () => {
    it('should accept valid input with token', () => {
      const validInput = { token: true };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents', () => {
      const validInput = { parents: true };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents', () => {
      const validInput = { parents: { upToDepth: 1 } };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and groups', () => {
      const validInput = { parents: { groups: true } };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and groups.groupParentsOfTokenUpToDepthOperatorSchema', () => {
      const validInput = {
        parents: { groups: { upToDepth: 'collection' } },
      };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and collections', () => {
      const validInput = { parents: { collections: true } };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should accept valid input with parents and collections.collectionParentsOfTokenUpToDepthOperatorSchema', () => {
      const validInput = { parents: { collections: { upToDepth: 1 } } };
      const result = tokenSelectSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual(validInput);
    });
    it('should reject invalid input with neither token nor parents', () => {
      const invalidInput = {};
      const result = tokenSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with invalid parents', () => {
      const invalidInput = { parents: { invalid: true } };
      const result = tokenSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with invalid groups', () => {
      const invalidInput = { parents: { groups: { invalid: true } } };
      const result = tokenSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
    it('should reject invalid input with invalid collections', () => {
      const invalidInput = { parents: { collections: { invalid: true } } };
      const result = tokenSelectSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('matchIsTokenWhere', () => {
    it('should accept valid input with token', () => {
      const validInput: TokenWhere = { token: 'a token', select: true };
      const result = matchIsTokenWhere(validInput);
      expect(result).toBe(true);
    });
    it('should reject invalid input without token', () => {
      const invalidInput = { invalid: true };
      const result = matchIsTokenWhere(
        // @ts-expect-error
        invalidInput,
      );
      expect(result).toBe(false);
    });
  });
});

describe.concurrent('groupWhereBaseSchema', () => {
  it('should validate the minimal value', () => {
    const value: z.infer<typeof groupWhereBaseSchema> = {
      group: '',
    };
    expect(groupWhereBaseSchema.safeParse(value).success).toBe(true);
  });
  it('should validate the maximal value', () => {
    const value: z.infer<typeof groupWhereBaseSchema> = {
      group: {
        name: 'a',
        description: 'b',
      },
      nestedIn: { group: true },
      atDepth: { upTo: 1 },
    };
    expect(groupWhereBaseSchema.safeParse(value).success).toBe(true);
  });
});

describe.concurrent('collectionWhereBaseSchema', () => {
  it('should validate the minimal value', () => {
    const value: z.infer<typeof collectionWhereBaseSchema> = {
      collection: '',
    };
    expect(collectionWhereBaseSchema.safeParse(value).success).toBe(true);
  });
  it('should validate the maximal value', () => {
    const value: z.infer<typeof collectionWhereBaseSchema> = {
      collection: {
        name: 'a',
        description: 'b',
      },
      nestedIn: { group: true },
      atDepth: { upTo: 1 },
      withModes: { include: ['a'] },
    };
    expect(collectionWhereBaseSchema.safeParse(value).success).toBe(true);
  });
});
