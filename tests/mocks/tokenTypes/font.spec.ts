import { describe, it, expect } from 'vitest';
import {
  makeSpecifyFontValueSchema,
  SpecifyFontValue,
} from '../../../src/definitions/tokenTypes/font.js';
import { getMockedFontValue } from '../../../src/mocks/tokenTypes/font.js';

describe('getMockedFontValue', () => {
  it('Should return a mocked font value', () => {
    const value = getMockedFontValue();

    expect(value).toHaveProperty('family');
    expect(value).toHaveProperty('postScriptName');
    expect(value).toHaveProperty('weight');
    expect(value).toHaveProperty('style');
    expect(value).toHaveProperty('files');
    expect(value.files[0]).toHaveProperty('format');
    expect(value.files[0]).toHaveProperty('url');
    expect(value.files[0]).toHaveProperty('provider');

    const result = makeSpecifyFontValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font value with override', () => {
    const override: SpecifyFontValue = {
      family: 'Arial',
      postScriptName: 'Arial',
      style: 'italic',
      weight: 400,

      files: [
        {
          format: 'woff2',
          url: 'https://fonts.specifyapp.com/fonts/arial.woff2',
          provider: 'Specify',
        },
      ],
    };

    const value = getMockedFontValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
