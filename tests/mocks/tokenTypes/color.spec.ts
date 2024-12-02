import { describe, it, expect } from 'vitest';
import { makeSpecifyColorValueSchema } from '../../../src/definitions/tokenTypes/color.js';
import { getMockedColorValue } from '../../../src/mocks/tokenTypes/color.js';

describe.concurrent('getMockedColorValue', () => {
  it('Should return a default mocked color value', () => {
    const value = getMockedColorValue();

    expect(value).toHaveProperty('model');
    expect(value).toHaveProperty('alpha');

    const result = makeSpecifyColorValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked color value with given model', () => {
    const model = 'rgb';

    const value = getMockedColorValue(undefined, model);

    expect(value).toHaveProperty('model', model);
    expect(value).toHaveProperty('alpha');
    expect(value).toHaveProperty('red');
    expect(value).toHaveProperty('green');
    expect(value).toHaveProperty('blue');
  });
  it('Should return a mocked color value with override', () => {
    const override = {
      model: 'hex',
      alpha: 1,
      hex: '#000000',
    } as const;

    const value = getMockedColorValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyColorValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should fail mocking a color value with invalid model', () => {
    const model = 'invalid' as const;

    expect(() =>
      getMockedColorValue(
        undefined,
        // @ts-expect-error
        model,
      ),
    ).toThrow(`Unhandled color model: "${model}"`);
  });
});
