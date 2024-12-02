import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../../src/engine/state/path/ValuePath.js';
import { PickSpecifyDesignToken } from '../../../../src/index.js';
import { parseRawTokenValue } from '../../../../src/engine/parser/internals/parseRawTokenValue.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('parseRawTokenValue', () => {
  it('should parse a primitive with default mode', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      default: 'a string',
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([]),
          value: 'a string',
        },
      ],
    });
  });
  it('should parse a primitive with N modes', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      small: 'a small string',
      medium: 'a medium string',
      large: 'a large string',
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'small',
          valuePath: new ValuePath([]),
          value: 'a small string',
        },
        {
          type: 'primitive',
          localMode: 'medium',
          valuePath: new ValuePath([]),
          value: 'a medium string',
        },
        {
          type: 'primitive',
          localMode: 'large',
          valuePath: new ValuePath([]),
          value: 'a large string',
        },
      ],
    });
  });
  it('should parse a dimension with default mode', () => {
    const value: PickSpecifyDesignToken<'dimension'>['$value'] = {
      default: {
        unit: 'px',
        value: 10,
      },
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath(['value']),
          value: 10,
        },
      ],
    });
  });
  it('should parse a dimension with N modes', () => {
    const value: PickSpecifyDesignToken<'dimension'>['$value'] = {
      small: {
        unit: 'px',
        value: 10,
      },
      medium: {
        unit: 'px',
        value: 20,
      },
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'small',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'small',
          valuePath: new ValuePath(['value']),
          value: 10,
        },
        {
          type: 'primitive',
          localMode: 'medium',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'medium',
          valuePath: new ValuePath(['value']),
          value: 20,
        },
      ],
    });
  });
  it('should parse a shadows with default mode', () => {
    const value: PickSpecifyDesignToken<'shadows'>['$value'] = {
      default: [
        {
          type: 'outer',
          offsetX: { unit: 'px', value: 2 },
          offsetY: { unit: 'px', value: 4 },
          blurRadius: { unit: 'px', value: 6 },
          spreadRadius: { unit: 'px', value: 8 },
          color: { model: 'hex', hex: '#000000', alpha: 0.25 },
        },
      ],
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'type']),
          value: 'outer',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetX', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetX', 'value']),
          value: 2,
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetY', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetY', 'value']),
          value: 4,
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'blurRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'blurRadius', 'value']),
          value: 6,
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'spreadRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'spreadRadius', 'value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'color', 'model']),
          value: 'hex',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'color', 'hex']),
          value: '#000000',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'color', 'alpha']),
          value: 0.25,
        },
      ],
    });
  });

  it('should parse a top level alias on string', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      $alias: 'group.stringAlias',
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['group', 'stringAlias']),
          },
        },
      ],
      primitiveParts: [],
    });
  });

  it('should parse a mode level alias on string', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      custom: {
        $alias: 'group.stringAlias',
        $mode: 'remote',
      },
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'custom',
          alias: {
            path: new TreePath(['group', 'stringAlias']),
            targetMode: 'remote',
          },
        },
      ],
      primitiveParts: [],
    });
  });
  it('should parse a mode level alias on one mode of a dimension', () => {
    const value: PickSpecifyDesignToken<'dimension'>['$value'] = {
      aliased: {
        $alias: 'group.dimensionAlias',
        $mode: 'remote',
      },
      raw: {
        unit: 'px',
        value: 10,
      },
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'aliased',
          alias: {
            path: new TreePath(['group', 'dimensionAlias']),
            targetMode: 'remote',
          },
        },
      ],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath(['value']),
          value: 10,
        },
      ],
    });
  });

  it('should parse a value level alias on a dimension value', () => {
    const value: PickSpecifyDesignToken<'dimension'>['$value'] = {
      default: {
        unit: 'px',
        value: {
          $alias: 'group.numberAlias',
          $mode: 'remote',
        },
      },
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [
        {
          type: 'valueLevelAlias',
          localMode: 'default',
          valuePath: new ValuePath(['value']),
          alias: {
            path: new TreePath(['group', 'numberAlias']),
            targetMode: 'remote',
          },
        },
      ],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
      ],
    });
  });
  it('should parse a value level alias on a shadows offsetX value', () => {
    const value: PickSpecifyDesignToken<'shadows'>['$value'] = {
      default: [
        {
          type: 'outer',
          offsetX: {
            $alias: 'group.dimensionAlias',
            $mode: 'remote',
          },
          offsetY: {
            unit: 'px',
            value: {
              $alias: 'group.numberAlias',
              $mode: 'remote',
            },
          },
          blurRadius: { unit: 'px', value: 6 },
          spreadRadius: { unit: 'px', value: 8 },
          color: { model: 'hex', hex: '#000000', alpha: 0.25 },
        },
      ],
    };

    const results = parseRawTokenValue(value);

    expect(results).toStrictEqual({
      aliasParts: [
        {
          type: 'valueLevelAlias',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetX']),
          alias: {
            path: new TreePath(['group', 'dimensionAlias']),
            targetMode: 'remote',
          },
        },
        {
          type: 'valueLevelAlias',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetY', 'value']),
          alias: {
            path: new TreePath(['group', 'numberAlias']),
            targetMode: 'remote',
          },
        },
      ],
      primitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'type']),
          value: 'outer',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'offsetY', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'blurRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'blurRadius', 'value']),
          value: 6,
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'spreadRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'spreadRadius', 'value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'color', 'model']),
          value: 'hex',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'color', 'hex']),
          value: '#000000',
        },
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([0, 'color', 'alpha']),
          value: 0.25,
        },
      ],
    });
  });

  it('should fail parsing a top level alias with $mode', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      $alias: 'group.stringAlias',
      $mode: 'remote',
    };

    expect(() => parseRawTokenValue(value)).toThrowError(
      'Cannot get value of token "group.stringAlias" with mode "remote" - Top level aliases cannot have a $mode.',
    );
  });
  it('should fail parsing a mode starting with $', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      $custom: 'a string',
    };

    expect(() => parseRawTokenValue(value, new TreePath(['my string']))).toThrowError(`[
  {
    "code": "custom",
    "message": "$mode cannot start with a \\"$\\"",
    "path": [
      "my string",
      "$value",
      "$custom"
    ]
  }
]`);
  });
  it('should fail parsing an empty string mode', () => {
    const value: PickSpecifyDesignToken<'string'>['$value'] = {
      '': 'a string',
    };

    expect(() => parseRawTokenValue(value, new TreePath(['my string']))).toThrowError(`[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "$mode must be a non-empty string",
    "path": [
      "my string",
      "$value",
      ""
    ]
  }
]`);
  });
});
