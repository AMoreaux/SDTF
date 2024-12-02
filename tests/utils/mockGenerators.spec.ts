import { describe, it, expect, vi } from 'vitest';

import {
  makeRandomString,
  pickRandomInList,
  pickRandomNumberInRange,
} from '../../src/utils/mockGenerators.js';

describe.concurrent('pickRandomInList', () => {
  it('Should pick a random item in list', () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const picked = pickRandomInList(list);
    expect(list).toContain(picked);
  });
  it('Should pick a random item in list', () => {
    const list = [1];
    const picked = pickRandomInList(list);
    expect(picked).toBe(1);
  });
  it('Should pick the first in list', () => {
    const rand = Math.random;
    Math.random = vi.fn(() => 0);

    const list = [1, 2, 3];
    const picked = pickRandomInList(list);
    expect(picked).toBe(1);

    Math.random = rand;
  });
  it('Should pick the middle in list of 3', () => {
    const rand = Math.random;
    Math.random = vi.fn(() => 0.5);

    const list = [1, 2, 3];
    const picked = pickRandomInList(list);
    expect(picked).toBe(2);

    Math.random = rand;
  });
  it('Should pick the last in list', () => {
    const rand = Math.random;
    Math.random = vi.fn(() => 1);

    const list = [1, 2, 3];
    const picked = pickRandomInList(list);
    expect(picked).toBe(3);

    Math.random = rand;
  });
});

describe.concurrent('pickRandomNumberInRange', () => {
  it('Should return an integer number between min and max', () => {
    const min = 0;
    const max = 100;
    const value = pickRandomNumberInRange(min, max);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
    expect(value).toBe(Math.floor(value));
  });
  it('Should return a float number between min and max with a precision of 2 digits', () => {
    const min = 0.1;
    const max = 5;
    const step = 0.02;
    const value = pickRandomNumberInRange(min, max, step);

    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
    expect(value).toBe(Number(value.toFixed(2)));
  });
  it('Should return a float number between min and max with narrow step', () => {
    const min = 0.4;
    const max = 0.5;
    const step = 0.1;
    const value = pickRandomNumberInRange(min, max, step);
    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);

    const isValid = value === 0.4 || value === 0.5;
    expect(isValid).toBe(true);
  });
  it('Should throw an error if step is less than 0', () => {
    expect(() => {
      pickRandomNumberInRange(0, 100, -1);
    }).toThrowError('Step must be greater than 0');
  });
});

describe.concurrent('makeRandomString', () => {
  it('Should return a string ', () => {
    const result = makeRandomString();
    expect(typeof result).toBe('string');
    expect(result.length).toBe(12);
  });
  it('Should return a string of length 8', () => {
    const result = makeRandomString(8);
    expect(typeof result).toBe('string');
    expect(result.length).toBe(8);
  });
});
