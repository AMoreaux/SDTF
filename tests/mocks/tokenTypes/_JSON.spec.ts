import { describe, it, expect } from 'vitest';

import {
  makeSpecifyJSONArrayValueSchema,
  makeSpecifyJSONBooleanValueSchema,
  makeSpecifyJSONNullValueSchema,
  makeSpecifyJSONNumberValueSchema,
  makeSpecifyJSONObjectValueSchema,
  makeSpecifyJSONStringValueSchema,
} from '../../../src/definitions/tokenTypes/_JSON.js';

import {
  getMockedJSONArrayValue,
  getMockedJSONBooleanValue,
  getMockedJSONNullValue,
  getMockedJSONNumberValue,
  getMockedJSONObjectValue,
  getMockedJSONStringValue,
} from '../../../src/mocks/tokenTypes/_JSON.js';

describe.concurrent('getMockedJSONStringValue', () => {
  it('Should return a string', () => {
    const value = getMockedJSONStringValue();
    expect(typeof value).toBe('string');

    const result = makeSpecifyJSONStringValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return the override value', () => {
    const override = 'string';
    const result = getMockedJSONStringValue(override);
    expect(result).toBe(override);
  });
});

describe.concurrent('getMockedJSONNumberValue', () => {
  it('Should return a number', () => {
    const value = getMockedJSONNumberValue();
    expect(typeof value).toBe('number');

    const result = makeSpecifyJSONNumberValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return the override value', () => {
    const override = 1;
    const result = getMockedJSONNumberValue(override);
    expect(result).toBe(override);
  });
});

describe.concurrent('getMockedJSONBooleanValue', () => {
  it('Should return a boolean', () => {
    const value = getMockedJSONBooleanValue();
    expect(typeof value).toBe('boolean');

    const result = makeSpecifyJSONBooleanValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return the override value', () => {
    const override = true;
    const result = getMockedJSONBooleanValue(override);
    expect(result).toBe(override);
  });
});

describe.concurrent('getMockedJSONNullValue', () => {
  it('Should return null', () => {
    const value = getMockedJSONNullValue();
    expect(value).toBeNull();

    const result = makeSpecifyJSONNullValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
});

describe.concurrent('getMockedJSONArrayValue', () => {
  it('Should return an array', () => {
    const value = getMockedJSONArrayValue();
    expect(Array.isArray(value)).toBeTruthy();

    const result = makeSpecifyJSONArrayValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return the override value', () => {
    const override = [1, '2', true, null];
    const result = getMockedJSONArrayValue(override);
    expect(result).toStrictEqual(override);
  });
});

describe.concurrent('getMockedJSONObjectValue', () => {
  it('Should return an object', () => {
    const value = getMockedJSONObjectValue();
    expect(typeof value).toBe('object');

    const result = makeSpecifyJSONObjectValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return the override value', () => {
    const override = { a: 1, b: '2', c: true, d: null };
    const result = getMockedJSONObjectValue(override);
    expect(result).toStrictEqual(override);
  });
});
