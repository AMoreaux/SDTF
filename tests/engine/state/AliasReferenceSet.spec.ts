import { describe, expect, it } from 'vitest';

import {
  ResolvableAliasReference,
  AliasReference,
  AliasReferenceSet,
  UnresolvableAliasReference,
} from '../../../src/engine/state/AliasReferenceSet.js';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('AliasReferenceSet', () => {
  describe.concurrent('(internal) getDeepFromTreePath', () => {
    it('should get an empty array if no reference matches the treePath', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(reference);

      expect(set.getDeepFromTreePath(new TreePath(['c']))).toEqual([]);
    });
    it('should get a shallow reference from a treePath', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(reference);

      expect(set.getDeepFromTreePath(new TreePath(['a']))).toEqual([reference]);
    });
    it('should get a single branch deep reference from a treePath', () => {
      const set = new AliasReferenceSet();
      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceA);

      const ReferenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(ReferenceB);

      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['d']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceC);

      expect(set.getDeepFromTreePath(new TreePath(['a']))).toEqual([referenceC]);
    });
    it('should get a multi branch deep reference from a treePath', () => {
      const set = new AliasReferenceSet();
      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: 'mode 1',
        },
        to: {
          treePath: new TreePath(['b']),
          mode: 'mode 1',
        },
        isResolvable: true,
      };
      set.add(referenceA);

      const referenceA2: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: 'mode 2',
        },
        to: {
          treePath: new TreePath(['z']),
          mode: 'mode 2',
        },
        isResolvable: true,
      };
      set.add(referenceA2);

      const referenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: 'mode 3',
        },
        to: {
          treePath: new TreePath(['c']),
          mode: 'mode 3',
        },
        isResolvable: true,
      };
      set.add(referenceB);

      const referenceB2: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: 'mode 4',
        },
        to: {
          treePath: new TreePath(['z']),
          mode: 'mode 4',
        },
        isResolvable: true,
      };
      set.add(referenceB2);

      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['d']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceC);

      const result = set.getDeepFromTreePath(new TreePath(['a']));

      expect(result).toEqual([referenceC, referenceB2, referenceA2]);
    });
  });
  describe.concurrent('(internal) getDeepToTreePath', () => {
    it('should get an empty array if no reference matches the treePath', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: null },
        to: { treePath: new TreePath(['b']), mode: null },
        isResolvable: true,
      };
      set.add(reference);

      expect(set.getDeepToTreePath(new TreePath(['c']))).toEqual([]);
    });
    it('should get a shallow reference from a treePath', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: null },
        to: { treePath: new TreePath(['b']), mode: null },
        isResolvable: true,
      };
      set.add(reference);

      expect(set.getDeepToTreePath(new TreePath(['b']))).toEqual([reference]);
    });
    it('should get a single branch deep reference from a treePath', () => {
      const set = new AliasReferenceSet();

      const ReferenceB: ResolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath([]), mode: null },
        to: { treePath: new TreePath(['a']), mode: null },
        isResolvable: true,
      };
      set.add(ReferenceB);

      const referenceC: ResolvableAliasReference = {
        from: { treePath: new TreePath(['c']), valuePath: new ValuePath([]), mode: null },
        to: { treePath: new TreePath(['b']), mode: null },
        isResolvable: true,
      };
      set.add(referenceC);

      const referenceD: ResolvableAliasReference = {
        from: { treePath: new TreePath(['d']), valuePath: new ValuePath([]), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      set.add(referenceD);

      const result = set.getDeepToTreePath(new TreePath(['a']));

      expect(result).toEqual([referenceD]);
    });
    it('should get a multi branch deep reference from a treePath', () => {
      const set = new AliasReferenceSet();

      const referenceB: ResolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath([]), mode: 'mode 1' },
        to: { treePath: new TreePath(['a']), mode: 'mode 1' },
        isResolvable: true,
      };
      set.add(referenceB);

      const referenceC: ResolvableAliasReference = {
        from: { treePath: new TreePath(['c']), valuePath: new ValuePath([]), mode: 'mode 2' },
        to: { treePath: new TreePath(['a']), mode: 'mode 2' },
        isResolvable: true,
      };
      set.add(referenceC);

      const referenceD: ResolvableAliasReference = {
        from: { treePath: new TreePath(['d']), valuePath: new ValuePath([]), mode: 'mode 3' },
        to: { treePath: new TreePath(['b']), mode: 'mode 3' },
        isResolvable: true,
      };
      set.add(referenceD);

      const result = set.getDeepToTreePath(new TreePath(['a']));

      expect(result).toEqual([referenceD, referenceC]);
    });
  });
  describe.concurrent('getOneDeepFrom', () => {
    it('should dig all the alias until the value', () => {
      const set = new AliasReferenceSet();

      const referenceB: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: 'mode 1' },
        to: { treePath: new TreePath(['b']), mode: 'mode 1' },
        isResolvable: true,
      };
      set.add(referenceB);

      const referenceC: ResolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath([]), mode: 'mode 1' },
        to: { treePath: new TreePath(['c']), mode: 'mode 2' },
        isResolvable: true,
      };
      set.add(referenceC);

      const referenceD: ResolvableAliasReference = {
        from: { treePath: new TreePath(['c']), valuePath: new ValuePath([]), mode: 'mode 2' },
        to: { treePath: new TreePath(['d']), mode: 'mode 3' },
        isResolvable: true,
      };
      set.add(referenceD);

      const result = set.getOneDeepFrom({
        treePath: new TreePath(['a']),
        valuePath: new ValuePath([]),
        mode: 'mode 1',
      });

      expect(result).toEqual({
        from: {
          mode: 'mode 1',
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
        },
        isResolvable: true,
        reason: undefined,
        to: {
          mode: 'mode 3',
          treePath: new TreePath(['d']),
        },
      });
    });

    it('should fail to resolve because of an unresolvable alias', () => {
      const set = new AliasReferenceSet();

      const referenceB: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: 'mode 1' },
        to: { treePath: new TreePath(['b']), mode: 'mode 1' },
        isResolvable: true,
      };
      set.add(referenceB);

      const referenceC: UnresolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath([]), mode: 'mode 1' },
        to: { treePath: new TreePath(['c']), mode: 'mode 2' },
        isResolvable: false,
        reason: 'hello',
      };
      set.add(referenceC);

      const result = set.getOneDeepFrom({
        treePath: new TreePath(['a']),
        valuePath: new ValuePath([]),
        mode: 'mode 1',
      });

      expect(result).toEqual({
        from: {
          mode: 'mode 1',
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
        },
        isResolvable: false,
        reason: 'hello',
        to: {
          mode: 'mode 2',
          treePath: new TreePath(['c']),
        },
      });
    });
  });
  describe.concurrent('add', () => {
    it('should add a reference', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      const output = [reference];

      set.add(reference);

      expect(Array.from(set)).toEqual(output);
    });
    it('should add a series of dependent references in ABC order', () => {
      const set = new AliasReferenceSet();
      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['d']),
          mode: null,
        },
        isResolvable: true,
      };
      const output = [referenceA, referenceB, referenceC];

      set.add(referenceA);
      set.add(referenceB);
      set.add(referenceC);

      expect(Array.from(set)).toEqual(output);
    });
    it('should add a series of multi-dependent references in ABC order', () => {
      const set = new AliasReferenceSet();
      const referenceA1: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: 'mode1',
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceA2: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: 'mode2',
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['d']),
          mode: null,
        },
        isResolvable: true,
      };
      const output = [referenceA1, referenceA2, referenceB, referenceC];

      set.add(referenceA1);
      set.add(referenceA2);
      set.add(referenceB);
      set.add(referenceC);

      expect(Array.from(set)).toEqual(output);
    });
    it('should add a a reference from a token used as reference to a token used as reference without circular reference', () => {
      const set = new AliasReferenceSet();
      const referenceA: ResolvableAliasReference = {
        isResolvable: true,
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: 'Mode 1' },
        to: { treePath: new TreePath(['z']), mode: 'Mode 2' },
      };
      set.add(referenceA);

      const referenceA2: ResolvableAliasReference = {
        isResolvable: true,
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: 'Mode 4' },
        to: { treePath: new TreePath(['y']), mode: 'Mode 5' },
      };
      set.add(referenceA2);

      const referenceB: ResolvableAliasReference = {
        isResolvable: true,
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath([]), mode: 'Mode 3' },
        to: { treePath: new TreePath(['c']), mode: 'Mode 3' },
      };
      set.add(referenceB);

      const referenceD: ResolvableAliasReference = {
        isResolvable: true,
        from: { treePath: new TreePath(['d']), valuePath: new ValuePath([]), mode: 'Mode 3' },
        to: { treePath: new TreePath(['c']), mode: 'Mode 3' },
      };
      set.add(referenceD);

      const referenceC: ResolvableAliasReference = {
        isResolvable: true,
        from: { treePath: new TreePath(['c']), valuePath: new ValuePath([]), mode: 'Mode 3' },
        to: { treePath: new TreePath(['a']), mode: 'Mode 1' },
      };
      set.add(referenceC);
    });
    it('should add a series of dependent references in CBA order', () => {
      const set = new AliasReferenceSet();

      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['d']),
          mode: null,
        },
        isResolvable: true,
      };
      const output = [referenceC, referenceB, referenceA];

      set.add(referenceC);
      set.add(referenceB);
      set.add(referenceA);

      expect(Array.from(set)).toEqual(output);
    });
    it('should fail when a reference already exists', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };

      set.add(reference);

      expect(() => {
        set.add(reference);
      }).toThrow(
        `Alias reference already exists for {"treePath":["a"],"valuePath":["b"],"mode":null}`,
      );
    });
    it('should fail when a reference points to itself', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['a']),
          mode: null,
        },
        isResolvable: true,
      };

      expect(() => {
        set.add(reference);
      }).toThrow(`Token "a" references itself`);
    });
    it('should fail with a circular reference of 2', () => {
      const set = new AliasReferenceSet();

      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceA);

      const ReferenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['a']),
          mode: null,
        },
        isResolvable: true,
      };

      expect(() => {
        set.add(ReferenceB);
      }).toThrow(`Token "b" circularly references "a"`);
    });
    it('should fail with a circular reference of 3', () => {
      const set = new AliasReferenceSet();
      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceA);

      const ReferenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(ReferenceB);

      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['a']),
          mode: null,
        },
        isResolvable: true,
      };

      expect(() => {
        set.add(referenceC);
      }).toThrow(`Token "c" circularly references "a"`);
    });
    it('should fail with a circular reference of 3 in ACB order', () => {
      const set = new AliasReferenceSet();

      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceA);

      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['a']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceC);

      const ReferenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };

      expect(() => {
        set.add(ReferenceB);
      }).toThrow(`Token "b" circularly references "c"`);
    });
    it('should fail with a circular reference of 4', () => {
      const set = new AliasReferenceSet();
      const referenceA: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['b']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceA);

      const ReferenceB: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['b']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(ReferenceB);

      const referenceC: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['c']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['d']),
          mode: null,
        },
        isResolvable: true,
      };
      set.add(referenceC);

      const referenceD: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['d']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['a']),
          mode: null,
        },
        isResolvable: true,
      };

      expect(() => {
        set.add(referenceD);
      }).toThrow(`Token "d" circularly references "a"`);
    });
    it('should fail with a circular reference of many with branching', () => {
      const set = new AliasReferenceSet();

      const referenceA: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: 'mode 1' },
        to: { treePath: new TreePath(['z']), mode: 'mode 1' },
        isResolvable: true,
      };
      set.add(referenceA);

      const referenceA2: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath([]), mode: 'mode 2' },
        to: { treePath: new TreePath(['y']), mode: 'mode 2' },
        isResolvable: true,
      };
      set.add(referenceA2);

      const referenceY: ResolvableAliasReference = {
        from: { treePath: new TreePath(['y']), valuePath: new ValuePath([]), mode: 'default' },
        to: { treePath: new TreePath(['x']), mode: 'default' },
        isResolvable: true,
      };
      set.add(referenceY);

      const ReferenceB: ResolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath([]), mode: 'default' },
        to: { treePath: new TreePath(['c']), mode: 'default' },
        isResolvable: true,
      };
      set.add(ReferenceB);

      const referenceC: ResolvableAliasReference = {
        from: { treePath: new TreePath(['c']), valuePath: new ValuePath([]), mode: 'default' },
        to: { treePath: new TreePath(['a']), mode: 'default' },
        isResolvable: true,
      };
      set.add(referenceC);

      const referenceX: ResolvableAliasReference = {
        from: { treePath: new TreePath(['x']), valuePath: new ValuePath([]), mode: 'default' },
        to: { treePath: new TreePath(['c']), mode: 'default' },
        isResolvable: true,
      };

      expect(() => {
        set.add(referenceX);
      }).toThrow(`Token "x" circularly references "c"`);
    });
  });
  describe.concurrent('updateAtFrom', () => {
    it('should update a reference', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const candidate: AliasReference = {
        from: { treePath: new TreePath(['x']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['d']), mode: null },
        isResolvable: true,
      };
      const output = [candidate];

      set.add(reference);
      set.updateAtFrom(reference.from, candidate);

      expect(Array.from(set)).toEqual(output);
    });
    it('should fail when a reference does not exist', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const candidate: AliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['d']), mode: null },
        isResolvable: true,
      };

      expect(() => {
        set.updateAtFrom(reference.from, candidate);
      }).toThrow(
        `Alias reference does not exist for {"treePath":["a"],"valuePath":["b"],"mode":null}`,
      );
    });
  });
  describe.concurrent('upsertAtFrom', () => {
    it('should add a reference', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const output = [reference];

      set.upsertAtFrom(reference);

      expect(Array.from(set)).toEqual(output);
    });
    it('should update a reference', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const candidate: AliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['e']), mode: 'dope' },
        isResolvable: true,
      };
      const output = [candidate];

      set.add(reference);
      set.upsertAtFrom(candidate);

      expect(Array.from(set)).toEqual(output);
    });
  });
  describe.concurrent('deleteOne', () => {
    it('should delete a reference', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };

      set.add(reference);
      set.deleteOne(reference.from);

      expect(Array.from(set)).toEqual([]);
    });
  });
  describe.concurrent('deleteManyFrom', () => {
    it('should delete references on treePath', () => {
      const set = new AliasReferenceSet();
      const reference1: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference2: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference4: ResolvableAliasReference = {
        from: { treePath: new TreePath(['x']), valuePath: new ValuePath(['x']), mode: null },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);
      set.add(reference4);
      set.deleteManyFrom({
        treePath: reference1.from.treePath,
      });

      expect(Array.from(set)).toEqual([reference4]);
    });
    it('should delete references on treePath and mode', () => {
      const set = new AliasReferenceSet();
      const reference1: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference2: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference4: ResolvableAliasReference = {
        from: { treePath: new TreePath(['x']), valuePath: new ValuePath(['x']), mode: null },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);
      set.add(reference4);
      set.deleteManyFrom({
        treePath: reference1.from.treePath,
        mode: reference1.from.mode,
      });

      expect(Array.from(set)).toEqual([reference3, reference4]);
    });
    it('should delete references on treePath, mode and valuePath', () => {
      const set = new AliasReferenceSet();
      const reference1: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference2: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference4: ResolvableAliasReference = {
        from: { treePath: new TreePath(['x']), valuePath: new ValuePath(['x']), mode: null },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);
      set.add(reference4);
      set.deleteManyFrom({
        treePath: reference1.from.treePath,
        mode: reference1.from.mode,
        valuePath: reference1.from.valuePath,
      });

      expect(Array.from(set)).toEqual([reference2, reference3, reference4]);
    });
  });
  describe.concurrent('unlinkManyTo', () => {
    it('should unlink references on treePath', () => {
      const set = new AliasReferenceSet();
      const reference1: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'default' },
        to: { treePath: new TreePath(['c']), mode: 'base' },
        isResolvable: true,
      };
      const reference2: ResolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);

      set.unlinkManyTo({
        treePath: reference1.to.treePath,
      });

      expect(Array.from(set)).toEqual([
        {
          ...reference1,
          isResolvable: false,
          reason: 'Token at path "c" has been unlinked',
        },
        {
          ...reference2,
          isResolvable: false,
          reason: 'Token at path "c" has been unlinked',
        },
        reference3,
      ]);
    });
    it('should unlink references on treePath and mode', () => {
      const set = new AliasReferenceSet();
      const reference1: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'default' },
        to: { treePath: new TreePath(['c']), mode: 'base' },
        isResolvable: true,
      };
      const reference2: ResolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: true,
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);

      set.unlinkManyTo({
        treePath: reference1.to.treePath,
        mode: reference1.to.mode,
      });

      expect(Array.from(set)).toEqual([
        {
          ...reference1,
          isResolvable: false,
          reason: 'Token at path "c" has been unlinked',
        },
        reference2,
        reference3,
      ]);
    });
  });
  describe.concurrent('linkManyTo', () => {
    it('should link references on treePath', () => {
      const set = new AliasReferenceSet();
      const reference1: UnresolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'default' },
        to: { treePath: new TreePath(['c']), mode: 'base' },
        isResolvable: false,
        reason: 'Token at path "c" has been unlinked',
      };
      const reference2: UnresolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: false,
        reason: 'Token at path "c" has been unlinked',
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);

      set.linkManyTo({
        treePath: reference1.to.treePath,
      });

      expect(Array.from(set)).toEqual([
        {
          from: reference1.from,
          to: reference1.to,
          isResolvable: true,
        },
        {
          from: reference2.from,
          to: reference2.to,
          isResolvable: true,
        },
        reference3,
      ]);
    });
    it('should link references on treePath and mode', () => {
      const set = new AliasReferenceSet();
      const reference1: UnresolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'default' },
        to: { treePath: new TreePath(['c']), mode: 'base' },
        isResolvable: false,
        reason: 'Token at path "c" has been unlinked',
      };
      const reference2: UnresolvableAliasReference = {
        from: { treePath: new TreePath(['b']), valuePath: new ValuePath(['f']), mode: null },
        to: { treePath: new TreePath(['c']), mode: null },
        isResolvable: false,
        reason: 'Token at path "c" has been unlinked',
      };
      const reference3: ResolvableAliasReference = {
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['g']), mode: 'base' },
        to: { treePath: new TreePath(['e']), mode: null },
        isResolvable: true,
      };

      set.add(reference1);
      set.add(reference2);
      set.add(reference3);

      set.linkManyTo({
        treePath: reference1.to.treePath,
        mode: reference1.to.mode,
      });

      expect(Array.from(set)).toEqual([
        {
          from: reference1.from,
          to: reference1.to,
          isResolvable: true,
        },
        reference2,
        reference3,
      ]);
    });
  });
  describe.concurrent('hasFrom', () => {
    it('should return true if a reference exists', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };

      set.add(reference);

      expect(set.hasFrom(reference.from)).toBe(true);
    });
    it('should return false if a reference does not exist', () => {
      const set = new AliasReferenceSet();

      expect(
        set.hasFrom({
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        }),
      ).toBe(false);
    });
  });
  describe.concurrent('getOne', () => {
    it('should return a reference', () => {
      const set = new AliasReferenceSet();
      const reference: ResolvableAliasReference = {
        from: {
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['c']),
          mode: null,
        },
        isResolvable: true,
      };

      set.add(reference);

      expect(set.getOne(reference.from)).toBe(reference);
    });
    it('should return undefined if the reference does not exists', () => {
      const set = new AliasReferenceSet();

      expect(
        set.getOne({
          treePath: new TreePath(['a']),
          valuePath: new ValuePath(['b']),
          mode: null,
        }),
      ).toBe(undefined);
    });
  });
  describe.concurrent('getManyTo', () => {
    it('should return all resolvable when options.isResolvable is undefined', () => {
      const set = new AliasReferenceSet();

      set.add({
        from: { treePath: new TreePath(['z']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['x']), mode: null },
        isResolvable: true,
      });

      const references: AliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['d']), valuePath: new ValuePath(['e']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['y']), valuePath: new ValuePath(['z']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: false,
          reason: 'not found',
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(4);

      expect(set.getManyTo({ treePath: new TreePath(['f']) })).toEqual(references);
    });
    it('should return all resolvable references when options.isResolvable is true', () => {
      const set = new AliasReferenceSet();

      set.add({
        from: { treePath: new TreePath(['z']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['x']), mode: null },
        isResolvable: true,
      });
      set.add({
        from: { treePath: new TreePath(['y']), valuePath: new ValuePath(['z']), mode: null },
        to: { treePath: new TreePath(['f']), mode: null },
        isResolvable: false,
        reason: 'not found',
      });

      const references: AliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['d']), valuePath: new ValuePath(['e']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(4);

      expect(
        set.getManyTo(
          {
            treePath: new TreePath(['f']),
          },
          {
            isResolvable: true,
          },
        ),
      ).toEqual(references);
    });
    it('should return all unresolvable references when options.isResolvable is false', () => {
      const set = new AliasReferenceSet();

      set.add({
        from: { treePath: new TreePath(['z']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['x']), mode: null },
        isResolvable: true,
      });
      set.add({
        from: { treePath: new TreePath(['d']), valuePath: new ValuePath(['e']), mode: null },
        to: { treePath: new TreePath(['f']), mode: null },
        isResolvable: true,
      });

      const references: AliasReference[] = [
        {
          from: { treePath: new TreePath(['y']), valuePath: new ValuePath(['z']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: false,
          reason: 'not found',
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(3);

      expect(
        set.getManyTo(
          {
            treePath: new TreePath(['f']),
          },
          {
            isResolvable: false,
          },
        ),
      ).toEqual(references);
    });
    it('should return matching references when mode is null', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['d']), valuePath: new ValuePath(['e']), mode: null },
          to: { treePath: new TreePath(['f']), mode: 'base' },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(2);

      expect(
        set.getManyTo(
          {
            treePath: new TreePath(['f']),
            mode: null,
          },
          { isResolvable: true },
        ),
      ).toEqual([references[0]]);
    });
    it('should return matching references when mode is defined', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: 'base' },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['d']), valuePath: new ValuePath(['e']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(2);

      expect(
        set.getManyTo(
          {
            treePath: new TreePath(['f']),
            mode: 'base',
          },
          { isResolvable: true },
        ),
      ).toEqual([references[0]]);
    });
  });
  describe.concurrent('getManyFrom', () => {
    it('should return all references when options.isResolvable is undefined', () => {
      const set = new AliasReferenceSet();

      set.add({
        from: { treePath: new TreePath(['z']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['a']), mode: null },
        isResolvable: true,
      });

      const references: AliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['z']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: false,
          reason: 'not found',
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(3);

      expect(set.getManyFrom({ treePath: new TreePath(['a']) })).toEqual(references);
    });
    it('should return all resolvable references when options.isResolvable is true', () => {
      const set = new AliasReferenceSet();

      set.add({
        from: { treePath: new TreePath(['z']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['a']), mode: null },
        isResolvable: true,
      });
      set.add({
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['z']), mode: null },
        to: { treePath: new TreePath(['f']), mode: null },
        isResolvable: false,
        reason: 'not found',
      });

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(3);

      expect(set.getManyFrom({ treePath: new TreePath(['a']) }, { isResolvable: true })).toEqual(
        references,
      );
    });
    it('should return all unresolvable references when options.isResolvable is false', () => {
      const set = new AliasReferenceSet();

      set.add({
        from: { treePath: new TreePath(['z']), valuePath: new ValuePath(['y']), mode: null },
        to: { treePath: new TreePath(['a']), mode: null },
        isResolvable: true,
      });
      set.add({
        from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
        to: { treePath: new TreePath(['f']), mode: null },
        isResolvable: true,
      });

      const references: AliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['z']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: false,
          reason: 'not found',
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(3);

      expect(
        set.getManyFrom(
          {
            treePath: new TreePath(['a']),
          },
          {
            isResolvable: false,
          },
        ),
      ).toEqual(references);
    });
    it('should return all matching references for valuePath', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['c']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(2);

      expect(
        set.getManyFrom(
          {
            treePath: new TreePath(['a']),
            valuePath: new ValuePath(['b']),
          },
          { isResolvable: true },
        ),
      ).toEqual([references[0]]);
    });
    it('should return matching references when mode is null', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'base' },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(2);

      expect(
        set.getManyFrom(
          {
            treePath: new TreePath(['a']),
            mode: null,
          },
          { isResolvable: true },
        ),
      ).toEqual([references[0]]);
    });
    it('should return matching references when mode is defined', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'base' },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(2);

      expect(
        set.getManyFrom(
          {
            treePath: new TreePath(['a']),
            mode: 'base',
          },
          { isResolvable: true },
        ),
      ).toEqual([references[0]]);
    });
    it('should return all matching references for valuePath and mode', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: 'base' },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['c']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['d']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(3);

      expect(
        set.getManyFrom(
          {
            treePath: new TreePath(['a']),
            valuePath: new ValuePath(['b']),
            mode: 'base',
          },
          { isResolvable: true },
        ),
      ).toEqual([references[0]]);
    });
  });
  describe.concurrent('clear', () => {
    it('should clear all references', () => {
      const set = new AliasReferenceSet();

      const references: ResolvableAliasReference[] = [
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['b']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['c']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
        {
          from: { treePath: new TreePath(['a']), valuePath: new ValuePath(['d']), mode: null },
          to: { treePath: new TreePath(['f']), mode: null },
          isResolvable: true,
        },
      ];

      references.forEach(reference => {
        set.add(reference);
      });

      expect(Array.from(set)).toHaveLength(3);

      set.clear();

      expect(Array.from(set)).toHaveLength(0);
    });
  });
});
