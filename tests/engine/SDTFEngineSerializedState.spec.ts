import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  SDTFEngineSerializedMetadata,
  sdtfEngineSerializedMetadataSchema,
} from '../../src/index.js';

import { Expect, Equal } from '../_utils.js';

describe.concurrent('SDTFEngineSerializedState', () => {
  describe.concurrent('sdtfEngineSerializedMetadataSchema', () => {
    it('expects types to match', () => {
      type res = Expect<
        Equal<SDTFEngineSerializedMetadata, z.infer<typeof sdtfEngineSerializedMetadataSchema>>
      >;
      expect(true).toBe(true);
    });
    it('should parse an empty state', () => {
      const state: SDTFEngineSerializedMetadata = {
        activeViewName: null,
        views: [],
      };

      const result = sdtfEngineSerializedMetadataSchema.parse(state);

      expect(result).toStrictEqual(state);
    });
    it('should parse a state with an active view', () => {
      const state: SDTFEngineSerializedMetadata = {
        activeViewName: 'view1',
        views: [
          {
            name: 'view1',
            query: {
              where: { token: '.*', select: true },
            },
          },
        ],
      };

      const result = sdtfEngineSerializedMetadataSchema.parse(state);

      expect(result).toStrictEqual(state);
    });
    it('should fail when the name of the active view is not null while the views are empty', () => {
      const state: SDTFEngineSerializedMetadata = {
        activeViewName: 'view1',
        views: [],
      };

      expect(() => sdtfEngineSerializedMetadataSchema.parse(state)).toThrow(`[
  {
    "code": "custom",
    "message": "activeViewName must be null when views is empty",
    "path": [
      "activeViewName"
    ]
  }
]`);
    });
    it('should fail when the name of the active view is not in the views', () => {
      const state: SDTFEngineSerializedMetadata = {
        activeViewName: 'view1',
        views: [
          {
            name: 'view2',
            query: {
              where: { token: '.*', select: true },
            },
          },
        ],
      };

      expect(() => sdtfEngineSerializedMetadataSchema.parse(state)).toThrow(`[
  {
    "code": "custom",
    "message": "activeViewName \\"${state.activeViewName}\\" must be null or one of the view names",
    "path": [
      "activeViewName"
    ]
  }
]`);
    });
    it('should fail when there are duplicate view names', () => {
      const state: SDTFEngineSerializedMetadata = {
        activeViewName: null,
        views: [
          {
            name: 'view1',
            query: {
              where: { token: '.*', select: true },
            },
          },
          {
            name: 'view1',
            query: {
              where: { token: '.*', select: true },
            },
          },
        ],
      };

      expect(() => sdtfEngineSerializedMetadataSchema.parse(state)).toThrow(`[
  {
    "code": "custom",
    "message": "Duplicate view name: \\"view1\\"",
    "path": [
      "views"
    ]
  }
]`);
    });
    it('should fail when the SDTF query is invalid', () => {
      const state: SDTFEngineSerializedMetadata = {
        activeViewName: null,
        views: [
          {
            name: 'view1',
            query: {
              // @ts-expect-error
              where: { token: '.*', select: 'invalid' },
            },
          },
        ],
      };

      expect(() => sdtfEngineSerializedMetadataSchema.parse(state)).toThrow(`[
  {
    "code": "custom",
    "message": "Invalid input",
    "path": [
      "views",
      0,
      "query"
    ]
  }
]`);
    });
  });
});
