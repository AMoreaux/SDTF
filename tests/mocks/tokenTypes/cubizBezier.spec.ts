import { describe, it, expect } from 'vitest';

import {
  makeSpecifyCubicBezierValueSchema,
  SpecifyCubicBezierValue,
} from '../../../src/definitions/tokenTypes/cubicBezier.js';
import { getMockedCubicBezierValue } from '../../../src/mocks/tokenTypes/cubicBezier.js';

describe.concurrent('getMockedCubicBezierValue', () => {
  it('Should return a mocked cubic bezier value', () => {
    const value = getMockedCubicBezierValue();

    expect(value).toHaveLength(4);
    const [x1, y1, x2, y2] = value;
    expect(typeof x1).toBe('number');
    expect(typeof y1).toBe('number');
    expect(typeof x2).toBe('number');
    expect(typeof y2).toBe('number');

    const result = makeSpecifyCubicBezierValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked cubic bezier value with override', () => {
    const override: SpecifyCubicBezierValue = [0.25, 0.1, 0.25, 1];

    const value = getMockedCubicBezierValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyCubicBezierValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
