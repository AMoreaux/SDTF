import { describe, it, expect } from 'vitest';
import { matchHasAllowedMode, matchHasIdenticalModes } from '../../../src/engine/utils/modes.js';

describe.concurrent('modes', () => {
  describe.concurrent('matchHasAllowedMode', () => {
    it('should return true if mode is allowed', () => {
      expect(matchHasAllowedMode('light', ['light', 'dark'])).toBe(true);
      expect(matchHasAllowedMode('dark', ['light', 'dark'])).toBe(true);
    });
    it('should return false if mode is not allowed', () => {
      expect(matchHasAllowedMode('other', ['light', 'dark'])).toBe(false);
      expect(matchHasAllowedMode('some', [])).toBe(false);
    });
  });
  describe.concurrent('matchHasIdenticalModes', () => {
    it('should return true if modes are identical', () => {
      expect(matchHasIdenticalModes(['light', 'dark'], ['light', 'dark'])).toBe(true);
      expect(matchHasIdenticalModes(['light', 'dark'], ['dark', 'light'])).toBe(true);
    });
    it('should return false if modes are not identical', () => {
      expect(matchHasIdenticalModes(['light', 'dark'], ['light'])).toBe(false);
      expect(matchHasIdenticalModes(['light'], ['light', 'dark'])).toBe(false);
      expect(matchHasIdenticalModes(['light', 'dark'], ['light', 'other'])).toBe(false);
      expect(matchHasIdenticalModes([], [])).toBe(false);
    });
  });
});
