import { describe, it, expect } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  matchIsSpecifyCollection,
  specifyCollectionPropertiesSchema,
  SpecifyCollectionSettings,
} from '../../../src/definitions/internals/designTokenCollection.js';

describe.concurrent('designTokenCollection', () => {
  describe.concurrent('SpecifyDesignTokenCollectionProperties', () => {
    it('Should match the various return types', () => {
      expect(true).toBe(true);
      type $collection = Expect<
        Equal<
          SpecifyCollectionSettings,
          {
            $modes: [string, ...string[]];
          }
        >
      >;
    });
  });

  describe.concurrent('matchIsDesignTokenCollection', () => {
    it('should return true if the object is a design token collection', () => {
      const result = matchIsSpecifyCollection({
        $collection: {
          modes: ['light', 'dark'],
        },
      });
      expect(result).toBe(true);
    });
    it('should return false if the object is not a design token collection', () => {
      expect(matchIsSpecifyCollection({})).toBe(false);
      expect(matchIsSpecifyCollection({ $collection: true })).toBe(false);
      expect(matchIsSpecifyCollection([])).toBe(false);
      expect(matchIsSpecifyCollection(null)).toBe(false);
      expect(matchIsSpecifyCollection('')).toBe(false);
    });
  });

  describe.concurrent('specifyCollectionPropertiesSchema', () => {
    it('should be valid if the object is a design token collection', () => {
      const input = {
        $collection: {
          $modes: ['light', 'dark'],
        },
      };
      const result = specifyCollectionPropertiesSchema.parse(input);
      expect(result).toStrictEqual(input);
    });
    it('should be valid while striping out extra keys', () => {
      const input = {
        $collection: {
          $modes: ['light', 'dark'],
        },
        extraKey: true,
      };
      const result = specifyCollectionPropertiesSchema.parse(input);
      expect(result).toStrictEqual({
        $collection: input.$collection,
      });
    });
    it('should not be valid if the input is not a design token collection', () => {
      expect(() => specifyCollectionPropertiesSchema.parse({})).toThrow();
      expect(() => specifyCollectionPropertiesSchema.parse({ $collection: true })).toThrow();
      expect(() => specifyCollectionPropertiesSchema.parse([])).toThrow();
      expect(() => specifyCollectionPropertiesSchema.parse(null)).toThrow();
      expect(() => specifyCollectionPropertiesSchema.parse('')).toThrow();
    });
  });
});
