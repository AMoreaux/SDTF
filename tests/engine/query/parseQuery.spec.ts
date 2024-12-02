import { describe, it, expect } from 'vitest';
import { SDTFQuery } from '../../../src/engine/query/query.js';
import { parseQuery } from '../../../src/engine/query/parseQuery.js';

describe.concurrent('parseQuery', () => {
  it('should parse a simple group query', () => {
    const query: SDTFQuery = {
      where: {
        group: '^MyGroup$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse a simple collection query', () => {
    const query: SDTFQuery = {
      where: {
        collection: '^MyCollection$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse a simple token query', () => {
    const query: SDTFQuery = {
      where: {
        token: '^MyToken$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });

  it('should parse a recursive query of token in group', () => {
    const query: SDTFQuery = {
      where: {
        group: '^MyGroup$',
        andWhere: {
          token: '.*',
          select: true,
        },
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);

    expect(() =>
      parseQuery({
        where: {
          group: '^MyGroup$',
          andWhere: {
            token: '.*',
            // select: true,
          },
        },
      }),
    ).toThrow();
  });
  it('should parse a recursive query of token in group in collection', () => {
    const query: SDTFQuery = {
      where: {
        collection: '^MyCollection$',
        andWhere: {
          group: '^MyGroup$',
          andWhere: {
            token: '.*',
            select: true,
          },
        },
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should fail parsing a nested collection in collection query', () => {
    expect(() =>
      parseQuery({
        where: {
          collection: '^MyCollection$',
          andWhere: {
            collection: '^MyCollection$',
            andWhere: {
              token: '.*',
              select: true,
            },
          },
        },
      }),
    ).toThrow('Collection where operator cannot be nested in Collection');
  });

  it('should parse an array of where operators', () => {
    const query: SDTFQuery = {
      where: [
        {
          group: '^MyGroup$',
          select: true,
        },
        {
          collection: '^MyCollection$',
          select: true,
        },
      ],
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse an array of where operators with nested array', () => {
    const query: SDTFQuery = {
      where: [
        {
          group: '^aGroup',
          select: true,
        },
        {
          collection: '^MyCollection$',
          andWhere: [
            {
              group: '^MyGroup$',
              select: true,
            },
            {
              token: '^MyToken$',
              select: true,
            },
          ],
        },
      ],
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });

  it('should parse group.atDepth operator equalTo number', () => {
    const query: SDTFQuery = {
      where: {
        atDepth: { equalTo: 1 },
        group: '^any$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse group.atDepth operator upTo number', () => {
    const query: SDTFQuery = {
      where: {
        atDepth: { upTo: 1 },
        group: '^any$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse token.atDepth operator equalTo number', () => {
    const query: SDTFQuery = {
      where: {
        atDepth: { equalTo: 1 },
        token: '^any$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse token.atDepth operator upTo number', () => {
    const query: SDTFQuery = {
      where: {
        atDepth: { upTo: 1 },
        token: '^any$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse collection.atDepth operator equalTo number', () => {
    const query: SDTFQuery = {
      where: {
        atDepth: { equalTo: 1 },
        collection: '^any$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
  it('should parse collection.atDepth operator upTo number', () => {
    const query: SDTFQuery = {
      where: {
        atDepth: { upTo: 1 },
        collection: '^any$',
        select: true,
      },
    };
    const result = parseQuery(query);
    expect(result).toEqual(query);
  });
});
