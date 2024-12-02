import { describe, it, expect } from 'vitest';
import { matchIsUnknownUIValueMode, UnknownModeUIValue } from '../../../../src/index.js';

describe.concurrent('UIValueResult', () => {
  describe.concurrent('matchIsUnknownUIValueMode', () => {
    it('should return true if value is an UnknownUIValueMode', () => {
      const result = matchIsUnknownUIValueMode(new UnknownModeUIValue('foo'));

      expect(result).toBe(true);
    });
    it('should return false if value is not an UnknownUIValueMode', () => {
      const result = matchIsUnknownUIValueMode({
        _kind: 'ResolvableUIValueMode',
        mode: 'foo',
      });

      expect(result).toBe(false);
    });
  });
});
