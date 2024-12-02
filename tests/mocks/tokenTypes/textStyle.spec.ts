import { describe, it, expect } from 'vitest';

import {
  makeSpecifyTextStyleValueSchema,
  SpecifyTextStyleValue,
} from '../../../src/definitions/tokenTypes/textStyle.js';

import { getMockedTextStyleValue } from '../../../src/mocks/tokenTypes/textStyle.js';

describe('getMockedTextStyleValue', () => {
  it('Should return a mocked text-style value with nulls', () => {
    const value = getMockedTextStyleValue();

    expect(value).toHaveProperty('font');
    expect(value).toHaveProperty('fontSize');

    expect(value).toHaveProperty('color');
    expect(value).toHaveProperty('fontFeatures');
    expect(value).toHaveProperty('lineHeight');
    expect(value).toHaveProperty('letterSpacing');
    expect(value).toHaveProperty('paragraphSpacing');
    expect(value).toHaveProperty('textAlignHorizontal');
    expect(value).toHaveProperty('textAlignVertical');
    expect(value).toHaveProperty('textDecoration');
    expect(value).toHaveProperty('textIndent');
    expect(value).toHaveProperty('textTransform');

    expect(value.color).toBeNull();
    expect(value.fontFeatures).toBeNull();
    expect(value.lineHeight).toBeNull();
    expect(value.letterSpacing).toBeNull();
    expect(value.paragraphSpacing).toBeNull();
    expect(value.textAlignHorizontal).toBeNull();
    expect(value.textAlignVertical).toBeNull();
    expect(value.textDecoration).toBeNull();
    expect(value.textIndent).toBeNull();
    expect(value.textTransform).toBeNull();

    const result = makeSpecifyTextStyleValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked text-style value without nulls', () => {
    const value = getMockedTextStyleValue({}, false);

    expect(value.color).not.toBeNull();
    expect(value.fontFeatures).not.toBeNull();
    expect(value.lineHeight).not.toBeNull();
    expect(value.letterSpacing).not.toBeNull();
    expect(value.paragraphSpacing).not.toBeNull();
    expect(value.textAlignHorizontal).not.toBeNull();
    expect(value.textAlignVertical).not.toBeNull();
    expect(value.textDecoration).not.toBeNull();
    expect(value.textIndent).not.toBeNull();
    expect(value.textTransform).not.toBeNull();
  });
  it('Should return a mocked text-style value with partial', () => {
    const partial: SpecifyTextStyleValue = {
      font: {
        family: 'Candara',
        postScriptName: 'Candara_postScriptName',
        weight: 'medium',
        style: 'normal',
        files: [
          {
            url: 'https://fonts.specifyapp.com/font.otf',
            format: 'otf',
            provider: 'Specify',
          },
          {
            url: 'https://fonts.specifyapp.com/font.woff',
            format: 'woff',
            provider: 'Specify',
          },
        ],
      },
      fontSize: {
        value: 12,
        unit: 'em',
      },
      color: {
        model: 'hsb',
        alpha: 0.2861982056926069,
        hue: 335,
        saturation: 29,
        brightness: 44,
      },
      fontFeatures: ['ordinal', 'contextual'],
      lineHeight: {
        unit: 'em',
        value: 14.2,
      },
      letterSpacing: {
        value: 0.45,
        unit: 'px',
      },
      paragraphSpacing: {
        value: 8,
        unit: 'px',
      },
      textAlignHorizontal: 'justify',
      textAlignVertical: 'top',
      textDecoration: 'none',
      textIndent: {
        value: 8,
        unit: 'px',
      },
      textTransform: 'full-width',
    };
    const value = getMockedTextStyleValue(partial);

    expect(value).toStrictEqual(partial);
  });
});
