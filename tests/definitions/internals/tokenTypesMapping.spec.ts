import { describe, expect, it } from 'vitest';
import dlv from 'dlv';

import {
  specifyJSONStringTypeName,
  specifyJSONNumberTypeName,
  specifyHexadecimalColorStringTypeName,
  specifyRGBColorNumberTypeName,
  specifyDimensionUnitTypeName,
  specifyColorTypeName,
  specifyDimensionTypeName,
  specifyJSONBooleanTypeName,
  specifyJSONNullTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  matchTokenTypeAgainstMapping,
  TokenTypesMapping,
  validateTokenTypesMapping,
} from '../../../src/definitions/internals/tokenTypesMapping.js';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

describe.concurrent('matchTokenTypeAgainstMapping', () => {
  it('Should match any primitive type', () => {
    const type = 'some primitive string';
    const mapping: TokenTypesMapping = { _primitive: 'some primitive string' };
    const path = new ValuePath([]);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match a first level token type', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = { _tokenType: specifyJSONStringTypeName };
    const path = new ValuePath([]);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match an array of token types', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _arrayOf: [{ _tokenType: specifyJSONStringTypeName }],
    };
    const path = new ValuePath([]);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match into a map of token types', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        someKey: { _tokenType: specifyJSONStringTypeName },
      },
    };
    const path = new ValuePath(['someKey']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should fail matching into a map of token types', () => {
    const type = specifyJSONNumberTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        someKey: { _tokenType: specifyJSONStringTypeName },
      },
    };
    const path = new ValuePath(['someKey']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(false);
    expect((result as any).expectedType).toBe(specifyJSONStringTypeName);
  });
  it('Should throw trying to match a map of token types with empty path', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        someKey: { _tokenType: specifyJSONStringTypeName },
      },
    };
    const path = new ValuePath([]);

    expect(() => {
      matchTokenTypeAgainstMapping(type, mapping, path);
    }).toThrow('Expected "selector" in path to be defined to match against a "_mapOf"');
  });
  it('Should throw trying to match a map of token types with invalid path', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        someKey: { _tokenType: specifyJSONStringTypeName },
      },
    };
    const path = new ValuePath(['invalid-path']);

    expect(() => {
      matchTokenTypeAgainstMapping(type, mapping, path);
    }).toThrow('Expected "_mapOf[selector]" to be defined');
  });
  it('Should match a union of first level token types', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _unionOf: [
        { _tokenType: specifyJSONStringTypeName },
        { _tokenType: specifyJSONNumberTypeName },
      ],
    };
    const path = new ValuePath([]);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should fail matching a union of first level token types', () => {
    const type = specifyHexadecimalColorStringTypeName;
    const mapping: TokenTypesMapping = {
      _unionOf: [
        { _tokenType: specifyJSONStringTypeName },
        { _tokenType: specifyJSONNumberTypeName },
      ],
    };
    const path = new ValuePath([]);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(false);
    expect((result as any).expectedType).toBe(
      `${specifyJSONStringTypeName}, ${specifyJSONNumberTypeName}`,
    );
  });
  it('Should match a tuple of token types', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _tuple: [
        { _tokenType: specifyJSONNumberTypeName },
        { _tokenType: specifyJSONStringTypeName },
      ],
    };
    const path = new ValuePath(['1']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should fail matching a tuple of non-matching token types', () => {
    const type = specifyRGBColorNumberTypeName;
    const mapping: TokenTypesMapping = {
      _tuple: [
        { _tokenType: specifyJSONNumberTypeName },
        { _tokenType: specifyJSONStringTypeName },
      ],
    };
    const path = new ValuePath(['1']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(false);
    expect((result as any).expectedType).toBe(specifyJSONStringTypeName);
  });
  it('Should match a discriminated union types', () => {
    const type = specifyRGBColorNumberTypeName;
    const mapping: TokenTypesMapping = {
      _discriminator: 'model',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            model: { _primitive: 'hex' },
            hex: { _tokenType: specifyHexadecimalColorStringTypeName },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'rgb' },
            red: { _tokenType: specifyRGBColorNumberTypeName },
            green: { _tokenType: specifyRGBColorNumberTypeName },
            blue: { _tokenType: specifyRGBColorNumberTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['red']);
    const getDiscriminator = () => 'rgb';

    const result = matchTokenTypeAgainstMapping(type, mapping, path, getDiscriminator);

    expect(result.success).toBe(true);
  });
  it('Should throw trying to match a discriminated union types without a discriminator', () => {
    const type = specifyRGBColorNumberTypeName;
    const mapping: TokenTypesMapping = {
      _discriminator: 'model',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            model: { _primitive: 'hex' },
            hex: { _tokenType: specifyHexadecimalColorStringTypeName },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'rgb' },
            red: { _tokenType: specifyRGBColorNumberTypeName },
            green: { _tokenType: specifyRGBColorNumberTypeName },
            blue: { _tokenType: specifyRGBColorNumberTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['red']);
    const discriminator = undefined;

    expect(() => {
      matchTokenTypeAgainstMapping(type, mapping, path, discriminator);
    }).toThrow('Expected "discriminator" to be defined');
  });
  it('Should throw trying to match a discriminated union types without a matching discriminator', () => {
    const type = specifyRGBColorNumberTypeName;
    const mapping: TokenTypesMapping = {
      _discriminator: 'model',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            model: { _primitive: 'hex' },
            hex: { _tokenType: specifyHexadecimalColorStringTypeName },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'rgb' },
            red: { _tokenType: specifyRGBColorNumberTypeName },
            green: { _tokenType: specifyRGBColorNumberTypeName },
            blue: { _tokenType: specifyRGBColorNumberTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['red']);
    const getDiscriminator = () => 'invalid';

    expect(() => {
      matchTokenTypeAgainstMapping(type, mapping, path, getDiscriminator);
    }).toThrow('Expected "mapOfTypes" to be defined');
  });
  it('Should throw trying to match a discriminated union types without a matching discriminator primitive value', () => {
    const type = specifyRGBColorNumberTypeName;
    const mapping: TokenTypesMapping = {
      _discriminator: 'model',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            model: { _tokenType: 'INVALID' },
            hex: { _tokenType: specifyHexadecimalColorStringTypeName },
          },
        },
        {
          _mapOf: {
            model: { _primitive: 'rgb' },
            red: { _tokenType: specifyRGBColorNumberTypeName },
            green: { _tokenType: specifyRGBColorNumberTypeName },
            blue: { _tokenType: specifyRGBColorNumberTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['red']);
    const getDiscriminator = () => 'hex';

    expect(() => {
      matchTokenTypeAgainstMapping(type, mapping, path, getDiscriminator);
    }).toThrow('Expected "_mapOf[discriminator]" to be a primitive');
  });

  it('Should match a nested tuple of types', () => {
    const type = specifyDimensionUnitTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        some: {
          _mapOf: {
            nestedTuple: {
              _tuple: [
                { _tokenType: specifyColorTypeName },
                { _tokenType: specifyDimensionUnitTypeName },
              ],
            },
          },
        },
      },
    };
    const path = new ValuePath(['some', 'nestedTuple', '1']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match a tuple of nested map of types', () => {
    const type = specifyDimensionUnitTypeName;
    const mapping: TokenTypesMapping = {
      _tuple: [
        {
          _mapOf: {
            some: { _tokenType: specifyColorTypeName },
          },
        },
        {
          _mapOf: {
            other: { _tokenType: specifyDimensionUnitTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['1', 'other']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match a nested array of types', () => {
    const type = specifyDimensionUnitTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        some: {
          _mapOf: {
            nestedArray: {
              _arrayOf: [{ _tokenType: specifyDimensionUnitTypeName }],
            },
          },
        },
      },
    };
    const path = new ValuePath(['some', 'nestedArray', '1']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match an array of a nested map of types', () => {
    const tokenValue = [
      {
        some: {
          type: 'first',
          value: 1,
        },
      },
    ];
    const type = specifyJSONNumberTypeName;
    const mapping: TokenTypesMapping = {
      _arrayOf: [
        {
          _mapOf: {
            some: {
              _discriminator: 'type',
              _discriminatedUnionOf: [
                {
                  _mapOf: {
                    type: { _primitive: 'first' },
                    value: { _tokenType: specifyJSONNumberTypeName },
                  },
                },
                {
                  _mapOf: {
                    type: { _primitive: 'second' },
                    value: { _tokenType: specifyJSONStringTypeName },
                  },
                },
              ],
            },
          },
        },
      ],
    };
    const path = new ValuePath(['0', 'some', 'value']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path, discriminatorKeyPath => {
      return dlv(tokenValue, discriminatorKeyPath);
    });
    expect(result.success).toBe(true);
  });
  it('Should match an union of nested maps of types', () => {
    const type = specifyJSONNumberTypeName;
    const mapping: TokenTypesMapping = {
      _unionOf: [
        {
          _mapOf: {
            some: { _tokenType: specifyJSONStringTypeName },
          },
        },
        {
          _mapOf: {
            some: { _tokenType: specifyJSONNumberTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['some']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match an union of nested discriminated union of types', () => {
    const tokenValue = {
      someDiscrimination: {
        type: 'forNumber',
        value: 1,
      },
    };
    const type = specifyJSONNumberTypeName;
    const mapping: TokenTypesMapping = {
      _unionOf: [
        {
          _mapOf: {
            someString: { _tokenType: specifyJSONStringTypeName },
          },
        },
        {
          _mapOf: {
            someDiscrimination: {
              _discriminator: 'type',
              _discriminatedUnionOf: [
                {
                  _mapOf: {
                    type: { _primitive: 'forString' },
                    value: { _tokenType: specifyJSONStringTypeName },
                  },
                },
                {
                  _mapOf: {
                    type: { _primitive: 'forNumber' },
                    value: { _tokenType: specifyJSONNumberTypeName },
                  },
                },
              ],
            },
          },
        },
      ],
    };
    const path = new ValuePath(['someDiscrimination', 'value']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path, discriminatorKeyPath => {
      return dlv(tokenValue, discriminatorKeyPath);
    });
    expect(result.success).toBe(true);
  });
  it('Should match a nested union of nested maps of types', () => {
    const type = specifyJSONNumberTypeName;
    const mapping: TokenTypesMapping = {
      _mapOf: {
        union: {
          _unionOf: [
            {
              _mapOf: {
                someString: { _tokenType: specifyJSONStringTypeName },
              },
            },
            {
              _mapOf: {
                someNumber: { _tokenType: specifyJSONNumberTypeName },
              },
            },
          ],
        },
      },
    };
    const path = new ValuePath(['union', 'someNumber']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result.success).toBe(true);
  });
  it('Should match a key of a map inside a discriminated union of union', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _unionOf: [
        { _tokenType: 'firstLevelMatching' },
        {
          _discriminator: 'type',
          _discriminatedUnionOf: [
            {
              _mapOf: {
                type: { _primitive: 'type1' },
                aString: { _tokenType: specifyJSONStringTypeName },
              },
            },
            {
              _mapOf: {
                type: { _primitive: 'type2' },
              },
            },
          ],
        },
      ],
    };
    const path = new ValuePath(['aString']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path, () => 'type1');

    expect(result.success).toBe(true);
  });
  it('Should match a key of a map belonging to a nested discriminated union of discriminated union', () => {
    const type = specifyJSONStringTypeName;
    const mapping: TokenTypesMapping = {
      _discriminator: 'parentType',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            parentType: { _primitive: 'parentType1' },
            aSubMap: {
              _discriminator: 'childType',
              _discriminatedUnionOf: [
                {
                  _mapOf: {
                    childType: { _primitive: 'childType1' },
                    aSubSubMap: {
                      _discriminator: 'subChildType',
                      _discriminatedUnionOf: [
                        {
                          _mapOf: {
                            subChildType: { _primitive: 'subChildType1' },
                            aString: { _tokenType: specifyJSONStringTypeName },
                          },
                        },
                        {
                          _mapOf: {
                            subChildType: { _primitive: 'subChildType2' },
                            aNull: { _tokenType: specifyJSONNullTypeName },
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  _mapOf: {
                    childType: { _primitive: 'childType2' },
                    aBoolean: { _tokenType: specifyJSONBooleanTypeName },
                  },
                },
              ],
            },
          },
        },
        {
          _mapOf: {
            parentType: { _primitive: 'parentType2' },
            aNumber: { _tokenType: specifyJSONNumberTypeName },
          },
        },
      ],
    };
    const path = new ValuePath(['aSubMap', 'aSubSubMap', 'aString']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path, cbPath => {
      if (cbPath.join(',') === 'parentType') {
        return 'parentType1';
      }
      if (cbPath.join(',') === 'aSubMap,childType') {
        return 'childType1';
      }
      if (cbPath.join(',') === 'aSubMap,aSubSubMap,subChildType') {
        return 'subChildType1';
      }
      return '';
    });

    expect(result.success).toBe(true);
  });

  it('Should fail matching a tokenType inside a map inside a union', () => {
    const type = specifyDimensionTypeName;
    const mapping: TokenTypesMapping = {
      _unionOf: [
        { _tokenType: specifyDimensionTypeName },
        {
          _mapOf: {
            unit: {
              _tokenType: specifyDimensionUnitTypeName,
            },
            value: {
              _tokenType: specifyJSONNumberTypeName,
            },
          },
        },
      ],
    };
    const path = new ValuePath(['value']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result).toStrictEqual({
      success: false,
      expectedType: specifyJSONNumberTypeName,
    });
  });
  it('Should fail matching an invalid primitive inside a map inside a union', () => {
    const type = 'aValue';
    const mapping: TokenTypesMapping = {
      _unionOf: [
        { _tokenType: 'a-type' },
        {
          _mapOf: {
            aPrimitive: {
              _primitive: 'someValue',
            },
          },
        },
      ],
    };
    const path = new ValuePath(['aPrimitive']);

    const result = matchTokenTypeAgainstMapping(type, mapping, path);
    expect(result).toStrictEqual({
      success: false,
      expectedType: '"someValue"',
    });
  });
});

describe.concurrent('validateTokenTypesMapping', () => {
  it('Should validate a valid mapping', () => {
    const mapping: TokenTypesMapping = {
      _mapOf: {
        map: {
          _mapOf: {
            nestedTuple: {
              _tuple: [
                { _tokenType: specifyColorTypeName },
                { _tokenType: specifyDimensionUnitTypeName },
              ],
            },
          },
        },
        array: {
          _arrayOf: [{ _tokenType: specifyColorTypeName }],
        },
        union: {
          _unionOf: [
            { _tokenType: specifyColorTypeName },
            { _tokenType: specifyDimensionUnitTypeName },
          ],
        },
        discriminatedUnion: {
          _discriminator: 'type',
          _discriminatedUnionOf: [
            {
              _mapOf: {
                type: { _primitive: 'first' },
              },
            },
            {
              _mapOf: {
                type: { _primitive: 'second' },
              },
            },
          ],
        },
        primitive: { _primitive: 'someprimitive' },
        tokenType: { _tokenType: specifyColorTypeName },
      },
    };

    const result = validateTokenTypesMapping(mapping);
    expect(result).toStrictEqual(mapping);
  });
  it('Should throw an error if arrayOf is of length 0', () => {
    const mapping: TokenTypesMapping = {
      _arrayOf: [],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Array must contain at least 1 element(s)",
    "path": [
      "_arrayOf"
    ]
  }
]`,
    );
  });
  it('Should throw an error if arrayOf is of > 1', () => {
    const mapping: TokenTypesMapping = {
      _arrayOf: [{ _tokenType: specifyColorTypeName }, { _tokenType: specifyColorTypeName }],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "too_big",
    "maximum": 1,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Array must contain at most 1 element(s)",
    "path": [
      "_arrayOf"
    ]
  }
]`,
    );
  });
  it('Should throw an error if union children is of length 0', () => {
    const mapping: TokenTypesMapping = {
      _unionOf: [],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "too_small",
    "minimum": 2,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Array must contain at least 2 element(s)",
    "path": [
      "_unionOf"
    ]
  }
]`,
    );
  });
  it('Should throw an error if union children is of length 1', () => {
    const mapping: TokenTypesMapping = {
      _unionOf: [{ _tokenType: specifyColorTypeName }],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "too_small",
    "minimum": 2,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Array must contain at least 2 element(s)",
    "path": [
      "_unionOf"
    ]
  }
]`,
    );
  });
  it('Should throw an error if discriminatedUnion children is of length 0', () => {
    const mapping: TokenTypesMapping = {
      _discriminator: 'type',
      _discriminatedUnionOf: [],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "too_small",
    "minimum": 2,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Array must contain at least 2 element(s)",
    "path": [
      "_discriminatedUnionOf"
    ]
  }
]`,
    );
  });
  it('Should throw an error if discriminatedUnion children is of length 1', () => {
    const mapping: TokenTypesMapping = {
      _discriminator: 'type',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            type: { _primitive: 'first' },
          },
        },
      ],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "too_small",
    "minimum": 2,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Array must contain at least 2 element(s)",
    "path": [
      "_discriminatedUnionOf"
    ]
  }
]`,
    );
  });
  it('Should throw an error if discriminatedUnion children is not map', () => {
    const mapping: TokenTypesMapping = {
      _discriminator: 'type',
      _discriminatedUnionOf: [
        {
          // @ts-expect-error
          _tokenType: specifyColorTypeName,
        },
        {
          // @ts-expect-error
          _tokenType: specifyJSONNumberTypeName,
        },
      ],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError();
  });
  it('Should throw an error if discriminatedUnion children does not implement the discriminator', () => {
    const mapping: TokenTypesMapping = {
      _discriminator: 'type',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            type: { _primitive: 'first' },
          },
        },
        {
          _mapOf: {
            nope: { _primitive: 'second' },
          },
        },
      ],
    };

    expect(() => validateTokenTypesMapping(mapping)).toThrowError(
      `[
  {
    "code": "custom",
    "message": "Discriminator must be present in all variants",
    "path": []
  }
]`,
    );
  });
});
