import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';
import { TokenRawValueParts } from '../../../src/engine/state/TokenRawValueParts.js';

describe.concurrent('TokenRawValueParts', () => {
  describe.concurrent('get size', () => {
    it('should return 0 if the set is empty', () => {
      const parts = new TokenRawValueParts();
      const result = parts.size;
      expect(result).toBe(0);
    });
    it('should return the number of parts in the set', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'loose', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });
      const result = parts.size;
      expect(result).toBe(2);
    });
  });
  describe.concurrent('get modes', () => {
    it('should return an empty array if the set is empty', () => {
      const parts = new TokenRawValueParts();
      const result = parts.modes;
      expect(result).toEqual([]);
    });
    it('should return an array with one mode if the set contains parts with only one mode', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });
      const result = parts.modes;
      expect(result).toEqual(['strict']);
    });
    it('should return an array with multiple modes if the set contains parts with multiple modes', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'baz']), value: 'baz' });
      parts.add({ mode: 'loose', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });
      parts.add({ mode: 'loose', valuePath: new ValuePath(['foo', 'bar']), value: 'qux' });
      const result = parts.modes;
      expect(result).toEqual(['strict', 'loose']);
    });
  });
  describe.concurrent('clear', () => {
    it('should remove all parts from the set', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'loose', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });
      parts.clear();
      expect(parts.size).toBe(0);
    });
  });
  describe.concurrent('has - hasChildren - hasParent', () => {
    it('should return true if the set contains a part with matching mode, valuePath, and value', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      const result = parts.has({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']) });
      expect(result).toBe(true);
    });
    it('should return false if the set does contain a part without a matching mode, valuePath, and value', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      const result = parts.has({ mode: 'loose', valuePath: new ValuePath(['foo', 'bar']) });
      expect(result).toBe(false);
    });
    it('should return false if the set does not contain a part with matching mode and valuePath', () => {
      const parts = new TokenRawValueParts<unknown>();
      const result = parts.has({ mode: 'loose', valuePath: new ValuePath(['foo', 'bar']) });
      expect(result).toBe(false);
    });

    it('should return true as the children are here', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop2']), value: 1 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop3']), value: 2 });

      expect(parts.hasChildren({ mode: 'mode', valuePath: new ValuePath(['base']) })).toBeTruthy();
    });

    it("should return false as they're no children", () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop2']), value: 1 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop3']), value: 2 });

      expect(
        parts.hasChildren({ mode: 'mode', valuePath: new ValuePath(['not base']) }),
      ).toBeFalsy();
    });

    it('should return true as there is a parent', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base']), value: null });

      expect(
        parts.hasParent({ mode: 'mode', valuePath: new ValuePath(['base', 'a', 'value']) }),
      ).toBeTruthy();
    });

    it('should return false as there is no parent', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base']), value: null });

      expect(
        parts.hasParent({ mode: 'mode', valuePath: new ValuePath(['not base', 'a', 'value']) }),
      ).toBeFalsy();
    });
  });

  describe.concurrent('getChildren - getParent', () => {
    it('should get all the children', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop2']), value: 1 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'group', 'prop3']), value: 2 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['not base', 'prop3']), value: 2 });

      expect(parts.getChildren({ mode: 'mode', valuePath: new ValuePath(['base']) })).toEqual([
        {
          mode: 'mode',
          value: 0,
          valuePath: new ValuePath(['base', 'prop1']),
        },
        {
          mode: 'mode',
          value: 1,
          valuePath: new ValuePath(['base', 'prop2']),
        },
        {
          mode: 'mode',
          value: 2,
          valuePath: new ValuePath(['base', 'group', 'prop3']),
        },
      ]);
    });

    it('should get the parent', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['parent']), value: null });
      parts.add({
        mode: 'mode',
        valuePath: new ValuePath(['a parent', 'group', 'prop1']),
        value: 0,
      });

      expect(
        parts.getParent({ mode: 'mode', valuePath: new ValuePath(['parent', 'value']) }),
      ).toEqual({
        mode: 'mode',
        value: null,
        valuePath: new ValuePath(['parent']),
      });
    });

    it('should get the nearest parent', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['parent']), value: null });
      parts.add({
        mode: 'mode',
        valuePath: new ValuePath(['a parent', 'group', 'prop1']),
        value: 0,
      });

      expect(
        parts.getParent({ mode: 'mode', valuePath: new ValuePath(['parent', 'value']) }),
      ).toEqual({
        mode: 'mode',
        value: null,
        valuePath: new ValuePath(['parent']),
      });
    });

    it('should not get the parent', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['parent']), value: null });
      parts.add({
        mode: 'mode',
        valuePath: new ValuePath(['a parent', 'group', 'prop1']),
        value: 0,
      });

      expect(
        parts.getParent({ mode: 'mode', valuePath: new ValuePath(['another', 'path']) }),
      ).toBeUndefined();
    });

    it('should not get the parent 2', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['parent']), value: null });
      parts.add({
        mode: 'mode',
        valuePath: new ValuePath(['a parent', 'group', 'prop1']),
        value: 0,
      });

      expect(
        parts.getParent({ mode: 'mode', valuePath: new ValuePath(['a parent', 'group']) }),
      ).toBeUndefined();
    });
  });

  describe.concurrent('getAll', () => {
    it('should get all the raw parts with no mode specified', () => {
      const parts = new TokenRawValueParts<any>();
      const part1 = {
        mode: 'small',
        valuePath: new ValuePath([]),
        value: 12,
      };
      const part2 = {
        mode: 'large',
        valuePath: new ValuePath([]),
        value: 18,
      };
      parts.add(part1);
      parts.add(part2);
      expect(parts.getAll()).toStrictEqual([part1, part2]);
    });
    it('should get all the raw parts for the specified mode', () => {
      const parts = new TokenRawValueParts<any>();
      const part1 = {
        mode: 'small',
        valuePath: new ValuePath([]),
        value: 12,
      };
      const part2 = {
        mode: 'large',
        valuePath: new ValuePath([]),
        value: 18,
      };
      parts.add(part1);
      parts.add(part2);
      expect(parts.getAll({ mode: 'small' })).toStrictEqual([part1]);
    });
  });
  describe.concurrent('add', () => {
    it('should add a part and return true if the part is not already in the set', () => {
      const parts = new TokenRawValueParts<any>();
      const part = {
        mode: '',
        valuePath: new ValuePath(['a']),
        value: 'foo',
      };
      const result = parts.add(part);
      expect(result).toBe(true);
      expect([...parts]).toStrictEqual([part]);
    });
    it('should not add a part and return false if the part is already in the set', () => {
      const parts = new TokenRawValueParts<any>();
      const part = {
        mode: '',
        valuePath: new ValuePath(['a']),
        value: 'foo',
      };
      parts.add(part);
      const result = parts.add(part);
      expect(result).toBe(false);
      expect([...parts]).toStrictEqual([part]);
    });
    it('should not add a part and return false if the part is already in the set defined with a number', () => {
      const parts = new TokenRawValueParts<any>();
      const part = {
        mode: 'default',
        valuePath: new ValuePath([0]),
        value: 'foo',
      };
      parts.add(part);
      const result = parts.add({
        mode: 'default',
        valuePath: new ValuePath(['0']),
        value: 'foo',
      });
      expect(result).toBe(false);
      expect([...parts]).toStrictEqual([part]);
    });

    it('should add multiple parts to the set', () => {
      const parts = new TokenRawValueParts<any>();
      const part1 = {
        mode: '',
        valuePath: new ValuePath(['a']),
        value: 'foo',
      };
      const part2 = {
        mode: '',
        valuePath: new ValuePath(['b']),
        value: 'bar',
      };
      parts.add(part1);
      parts.add(part2);
      expect([...parts]).toStrictEqual([part1, part2]);
    });
  });
  describe.concurrent('update', () => {
    it('should return false if the set does not contain a part with matching mode and valuePath', () => {
      const parts = new TokenRawValueParts();
      const result = parts.update(
        { mode: 'strict', valuePath: new ValuePath(['foo', 'bar']) },
        { mode: 'strict', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' },
      );
      expect(result).toBe(false);
    });
    it('should update the part and return true if the set contains a part with matching mode and valuePath', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      const result = parts.update(
        { mode: 'strict', valuePath: new ValuePath(['foo', 'bar']) },
        { mode: 'strict', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' },
      );
      expect(result).toBe(true);
      expect(parts.has({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']) })).toBe(false);
      expect(parts.has({ mode: 'strict', valuePath: new ValuePath(['foo', 'baz']) })).toBe(true);
    });
  });
  describe.concurrent('delete', () => {
    it('should return false if the set does not contain a part with matching mode and valuePath', () => {
      const parts = new TokenRawValueParts();
      const result = parts.delete({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']) });
      expect(result).toBe(false);
    });
    it('should remove the part and return true if the set contains a part with matching mode and valuePath', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      const result = parts.delete({ mode: 'strict', valuePath: new ValuePath(['foo', 'bar']) });
      expect(result).toBe(true);
      expect([...parts]).toStrictEqual([]);
    });
  });
  describe.concurrent('hasMode', () => {
    it('should return false if the set does not contain a part with the given mode', () => {
      const parts = new TokenRawValueParts();
      const result = parts.hasMode('default');
      expect(result).toBe(false);
    });
    it('should return true if the set contains a part with the given mode', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'default', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      const result = parts.hasMode('default');
      expect(result).toBe(true);
    });
  });
  describe.concurrent('renameMode', () => {
    it('should rename the mode of all parts with the previous mode', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'default', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'custom', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });

      const result = parts.renameMode('default', 'newDefault');

      expect(result).toBe(true);
      expect(parts.has({ mode: 'default', valuePath: new ValuePath(['foo', 'bar']) })).toBe(false);
      expect(parts.has({ mode: 'newDefault', valuePath: new ValuePath(['foo', 'bar']) })).toBe(
        true,
      );
      expect(parts.has({ mode: 'custom', valuePath: new ValuePath(['foo', 'baz']) })).toBe(true);
    });
    it('should return false if no parts with the previous mode are found', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'custom', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });
      const result = parts.renameMode('default', 'newDefault');
      expect(result).toBe(false);
    });
  });
  describe.concurrent('deleteMode', () => {
    it('should remove all parts with the given mode', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'default', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'default', valuePath: new ValuePath(['foo', 'baz']), value: 'baz' });
      parts.add({ mode: 'custom', valuePath: new ValuePath(['foo', 'baz']), value: 'qux' });
      const result = parts.deleteMode('default');

      expect(result).toBe(true);
      expect(parts.has({ mode: 'default', valuePath: new ValuePath(['foo', 'bar']) })).toBe(false);
      expect(parts.has({ mode: 'default', valuePath: new ValuePath(['foo', 'baz']) })).toBe(false);
      expect(parts.has({ mode: 'custom', valuePath: new ValuePath(['foo', 'baz']) })).toBe(true);
    });
    it('should return false if no parts with the given mode are found', () => {
      const parts = new TokenRawValueParts();
      const result = parts.deleteMode('default');
      expect(result).toBe(false);
    });
  });
  describe.concurrent('toObject', () => {
    it('should return an object with the values of all parts', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'default', valuePath: new ValuePath(['foo', 'bar']), value: 'baz' });
      parts.add({ mode: 'custom', valuePath: new ValuePath(['foo', 'bar']), value: 'qux' });

      const result = parts.toObject();

      expect(result).toEqual({
        default: { foo: { bar: 'baz' } },
        custom: { foo: { bar: 'qux' } },
      });
    });
    it('should return an empty object if the set is empty', () => {
      const parts = new TokenRawValueParts();
      const result = parts.toObject();
      expect(result).toEqual({});
    });
    it('should return an object with number like keys', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'default', valuePath: new ValuePath(['color', '100']), value: 'baz' });
      const result = parts.toObject();
      expect(result).toEqual({
        default: { color: { 100: 'baz' } },
      });
    });
    it('should return an array with number keys', () => {
      const parts = new TokenRawValueParts();
      parts.add({ mode: 'default', valuePath: new ValuePath(['color', 1]), value: 'baz' });
      const result = parts.toObject();
      expect(result).toEqual({
        default: { color: [undefined, 'baz'] },
      });
    });
  });

  describe.concurrent('upsert', () => {
    it('should add a new part', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.upsert(
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']) },
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 },
      );

      expect(parts.getAll()).toEqual([
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 },
      ]);
    });

    it('should update a part', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 2 });
      parts.upsert(
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']) },
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1', 'prop2']), value: 0 },
      );

      expect(parts.getAll()).toEqual([
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1', 'prop2']), value: 0 },
      ]);
    });
    it('should add and update a part', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.upsert(
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']) },
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 2 },
      );
      parts.upsert(
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']) },
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 },
      );

      expect(parts.getAll()).toEqual([
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 0 },
      ]);
    });
  });

  describe.concurrent('filterDelete', () => {
    it('should filter everything', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 2 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop2']), value: 0 });

      parts.filterDelete(_ => true);
      expect(parts.getAll()).toEqual([]);
    });

    it('should filter everything but prop1', () => {
      const parts = new TokenRawValueParts<unknown>();
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 2 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop2']), value: 0 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop3']), value: 0 });
      parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop4']), value: 0 });

      parts.filterDelete(part => part.valuePath.at(1) !== 'prop1');
      expect(parts.getAll()).toEqual([
        { mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 2 },
      ]);
    });
  });

  it('should get all the raw part that start with the same prefix', () => {
    const parts = new TokenRawValueParts<unknown>();
    parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'prop1']), value: 2 });
    parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'next', 'value1']), value: 0 });
    parts.add({ mode: 'mode', valuePath: new ValuePath(['base', 'next', 'value2']), value: 0 });
    parts.add({ mode: 'mode', valuePath: new ValuePath(['notBase', 'prop3']), value: 0 });
    parts.add({ mode: 'mode', valuePath: new ValuePath(['notBase', 'prop4']), value: 0 });

    expect(
      parts.getRawPartsFromPrefix({ mode: 'mode', prefixPath: new ValuePath(['base', 'next']) }),
    ).toStrictEqual([
      { mode: 'mode', valuePath: new ValuePath(['base', 'next', 'value1']), value: 0 },
      { mode: 'mode', valuePath: new ValuePath(['base', 'next', 'value2']), value: 0 },
    ]);
  });
});
