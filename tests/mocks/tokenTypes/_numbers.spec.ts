import { describe, it, expect } from 'vitest';

import {
  makeSpecifyArcDegreeNumberValueSchema,
  makeSpecifyIntegerNumberValueSchema,
  makeSpecifyPercentageNumberValueSchema,
  makeSpecifyPositiveIntegerNumberValueSchema,
  makeSpecifyPositiveNumberValueSchema,
  makeSpecifyRGBColorNumberValueSchema,
  makeSpecifyZeroToOneNumberValueSchema,
} from '../../../src/definitions/tokenTypes/_numbers.js';

import {
  getMockedArcDegreeNumberValue,
  getMockedIntegerNumberValue,
  getMockedPercentageNumberValue,
  getMockedPositiveIntegerNumberValue,
  getMockedPositiveNumberValue,
  getMockedRGBColorNumberValue,
  getMockedZeroToOneNumberValue,
} from '../../../src/mocks/tokenTypes/_numbers.js';

describe.concurrent('Numbers mocks', () => {
  describe.concurrent('getMockedIntegerNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedIntegerNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyIntegerNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
  describe.concurrent('getMockedZeroToOneNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedZeroToOneNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyZeroToOneNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
  describe.concurrent('getMockedArcDegreeNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedArcDegreeNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyArcDegreeNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
  describe.concurrent('getMockedRGBColorNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedRGBColorNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyRGBColorNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
  describe.concurrent('getMockedPositiveNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedPositiveNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyPositiveNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
  describe.concurrent('getMockedPositiveIntegerNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedPositiveIntegerNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyPositiveIntegerNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
  describe.concurrent('getMockedPercentageNumberValue', () => {
    it('Should return a number', () => {
      const value = getMockedPercentageNumberValue();
      expect(typeof value).toBe('number');

      const result = makeSpecifyPercentageNumberValueSchema(false).parse(value);
      expect(result).toBe(value);
    });
  });
});
