import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifyBitmapFormatValueSchema,
  SpecifyBitmapFormatValue,
  specifyBitmapFormatValues,
  SpecifyBitmapFormatValueWithAlias,
} from '../../../src/definitions/tokenTypes/bitmapFormat.js';

describe.concurrent('bitmapFormat', () => {
  describe.concurrent('makeSpecifyBitmapFormatValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a bitmap format', () => {
      const input = 'png';
      const result = makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, 'png' | 'wp2' | 'avif' | 'webp' | 'jpg' | 'jxl'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBitmapFormatValue>>;

      expect(makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse('wp2')).toBe('wp2');
      expect(makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse('avif')).toBe(
        'avif',
      );
      expect(makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse('webp')).toBe(
        'webp',
      );
      expect(makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse('jpg')).toBe('jpg');
      expect(makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse('jxl')).toBe('jxl');
    });
    it('Should fail validating a string', () => {
      expect(() =>
        makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a bitmap format', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.bitmap.format',
        $mode: 'default',
      };
      const result = makeSpecifyBitmapFormatValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyBitmapFormatValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBitmapFormatValueWithAlias>>;
    });

    it('Should validate all runtime values available in `specifyBitmapFormatValues`', ({
      expect,
    }) => {
      specifyBitmapFormatValues.forEach(value => {
        expect(makeSpecifyBitmapFormatValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyBitmapFormatValues.length);
    });
  });
});
