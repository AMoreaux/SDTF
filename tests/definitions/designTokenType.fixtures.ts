import { SpecifyDesignToken } from '../../src/index.js';

export const designTokenFixtures: Array<SpecifyDesignToken> = [
  {
    $type: 'string',
    $value: {
      default: 'pmrfG88YrXAA',
    },
  },
  {
    $type: 'number',
    $value: {
      default: 126.1,
    },
  },
  {
    $type: 'boolean',
    $value: {
      default: true,
    },
  },
  {
    $type: 'null',
    $value: {
      default: null,
    },
  },
  {
    $type: 'array',
    $value: {
      default: [
        -42.4,
        'h2BYUaWOTM5Y',
        false,
        null,
        [74.4],
        {
          a: 1,
          b: '2',
          c: true,
        },
      ],
    },
  },
  {
    $type: 'object',
    $value: {
      default: {
        a: 1,
        b: '2',
        c: true,
        d: null,
        e: [-87.3, 50.6],
        f: {
          a: 1,
          b: '2',
          c: true,
        },
      },
    },
  },
  {
    $type: 'integerNumber',
    $value: {
      default: -629,
    },
  },
  {
    $type: 'zeroToOneNumber',
    $value: {
      default: 0.45,
    },
  },
  {
    $type: 'arcDegreeNumber',
    $value: {
      default: 127.64,
    },
  },
  {
    $type: 'rgbColorNumber',
    $value: {
      default: 234,
    },
  },
  {
    $type: 'positiveNumber',
    $value: {
      default: 606.93,
    },
  },
  {
    $type: 'positiveIntegerNumber',
    $value: {
      default: 279,
    },
  },
  {
    $type: 'percentageNumber',
    $value: {
      default: 96.14,
    },
  },
  {
    $type: 'hexadecimalColorString',
    $value: {
      default: '#DCCC55',
    },
  },
  {
    $type: 'bitmap',
    $value: {
      default: {
        url: 'https://sdtf.specifyapp.com/function makeRandomString(length = 12) {\n  let result = "";\n  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";\n  const charactersLength = characters.length;\n  let counter = 0;\n  while (counter < length) {\n    result += characters.charAt(Math.floor(Math.random() * charactersLength));\n    counter += 1;\n  }\n  return result;\n}',
        format: 'wp2',
        width: null,
        height: null,
        variationLabel: null,
        provider: 'Specify',
      },
    },
  },
  {
    $type: 'bitmapFormat',
    $value: {
      default: 'png',
    },
  },
  {
    $type: 'bitmaps',
    $value: {
      default: {
        files: [
          {
            url: 'https://sdtf.specifyapp.com/function makeRandomString(length = 12) {\n  let result = "";\n  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";\n  const charactersLength = characters.length;\n  let counter = 0;\n  while (counter < length) {\n    result += characters.charAt(Math.floor(Math.random() * charactersLength));\n    counter += 1;\n  }\n  return result;\n}',
            format: 'wp2',
            width: null,
            height: null,
            variationLabel: null,
            provider: 'Specify',
          },
          {
            url: 'https://sdtf.specifyapp.com/function makeRandomString(length = 12) {\n  let result = "";\n  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";\n  const charactersLength = characters.length;\n  let counter = 0;\n  while (counter < length) {\n    result += characters.charAt(Math.floor(Math.random() * charactersLength));\n    counter += 1;\n  }\n  return result;\n}',
            format: 'wp2',
            width: 12,
            height: 12,
            variationLabel: 'Label',
            provider: 'Specify',
          },
        ],
      },
    },
  },
  {
    $type: 'blur',
    $value: {
      default: {
        value: 3,
        unit: 'px',
      },
    },
  },
  {
    $type: 'border',
    $value: {
      default: {
        color: {
          model: 'hsb',
          alpha: 0.05,
          hue: 37.28,
          saturation: 4.85,
          brightness: 77.96,
        },
        style: 'groove',
        width: {
          value: 7,
          unit: 'px',
        },
        rectangleCornerRadii: null,
      },
    },
  },
  {
    $type: 'borderStyle',
    $value: {
      default: 'dashed',
    },
  },
  {
    $type: 'borderStyleLineCap',
    $value: {
      default: 'butt',
    },
  },
  {
    $type: 'breakpoint',
    $value: {
      default: {
        value: 414,
        unit: 'px',
      },
    },
  },
  {
    $type: 'color',
    $value: {
      default: {
        model: 'hex',
        alpha: 0.65,
        hex: '#0B8156',
      },
    },
  },
  {
    $type: 'cubicBezier',
    $value: {
      default: [0.7406448824986223, -3, 0.6925939328135422, 3],
    },
  },
  {
    $type: 'dimension',
    $value: {
      default: {
        value: 76,
        unit: 'vi',
      },
    },
  },
  {
    $type: 'dimensionUnit',
    $value: {
      default: 'svmax',
    },
  },
  {
    $type: 'duration',
    $value: {
      default: {
        value: 200,
        unit: 'ms',
      },
    },
  },
  {
    $type: 'durationUnit',
    $value: {
      default: 'ms',
    },
  },
  {
    $type: 'font',
    $value: {
      default: {
        family: 'Lucida Sans Unicode',
        postScriptName: 'Lucida Sans Unicode_postScriptName',
        weight: 'thin',
        style: 'normal',
        files: [
          {
            url: 'https://fonts.specifyapp.com/font.otf',
            format: 'otf',
            provider: 'Google Fonts',
          },
          {
            url: 'https://fonts.specifyapp.com/font.woff',
            format: 'woff',
            provider: 'Google Fonts',
          },
        ],
      },
    },
  },
  {
    $type: 'fontFamily',
    $value: {
      default: 'Proxima Nova',
    },
  },
  {
    $type: 'fontFeature',
    $value: {
      default: 'tabular-nums',
    },
  },
  {
    $type: 'fontFeatures',
    $value: {
      default: ['normal', 'tabular-nums'],
    },
  },
  {
    $type: 'fontFormat',
    $value: {
      default: 'woff',
    },
  },
  {
    $type: 'fontStyle',
    $value: {
      default: 'normal',
    },
  },
  {
    $type: 'fontWeight',
    $value: {
      default: 'black',
    },
  },
  {
    $type: 'gradient',
    $value: {
      default: {
        type: 'linear',
        angle: 294.03,
        colorStops: [
          {
            color: {
              model: 'lch',
              alpha: 0.02,
              lightness: 5.48,
              chroma: 56.72,
              hue: 108.19,
            },
            position: 0,
          },
          {
            color: {
              model: 'rgb',
              alpha: 0.56,
              red: 216,
              green: 175,
              blue: 45,
            },
            position: 0.5,
          },
          {
            color: {
              model: 'hsl',
              alpha: 0.38,
              hue: 279.71,
              saturation: 71.8,
              lightness: 39.15,
            },
            position: 1,
          },
        ],
      },
    },
  },
  {
    $type: 'gradients',
    $value: {
      default: [
        {
          type: 'radial',
          position: 'center',
          colorStops: [
            {
              color: {
                model: 'hsb',
                alpha: 0.09,
                hue: 82.14,
                saturation: 54.88,
                brightness: 13.99,
              },
              position: 0,
            },
            {
              color: {
                model: 'hsb',
                alpha: 0.68,
                hue: 102.29,
                saturation: 16.85,
                brightness: 35.93,
              },
              position: 1,
            },
          ],
        },
        {
          type: 'radial',
          position: 'center',
          colorStops: [
            {
              color: {
                model: 'lch',
                alpha: 0.87,
                lightness: 76.99,
                chroma: 270.89,
                hue: 21.81,
              },
              position: 0,
            },
            {
              color: {
                model: 'hsl',
                alpha: 0.46,
                hue: 114.36,
                saturation: 21.86,
                lightness: 32.42,
              },
              position: 1,
            },
          ],
        },
        {
          type: 'linear',
          angle: 279.23,
          colorStops: [
            {
              color: {
                model: 'hsl',
                alpha: 0.1,
                hue: 134.44,
                saturation: 52.85,
                lightness: 52.75,
              },
              position: 0,
            },
            {
              color: {
                model: 'lch',
                alpha: 0.14,
                lightness: 38.18,
                chroma: 88.2,
                hue: 89.21,
              },
              position: 0.5,
            },
            {
              color: {
                model: 'hsl',
                alpha: 0.09,
                hue: 225.09,
                saturation: 37.09,
                lightness: 76.65,
              },
              position: 1,
            },
          ],
        },
      ],
    },
  },
  {
    $type: 'opacity',
    $value: {
      default: 0.19,
    },
  },
  {
    $type: 'radii',
    $value: {
      default: [
        {
          value: 14,
          unit: 'px',
        },
        {
          value: 17,
          unit: 'px',
        },
        {
          value: 30,
          unit: 'px',
        },
      ],
    },
  },
  {
    $type: 'radius',
    $value: {
      default: {
        value: 14,
        unit: 'px',
      },
    },
  },
  {
    $type: 'shadow',
    $value: {
      default: {
        offsetX: {
          value: 18,
          unit: 'px',
        },
        offsetY: {
          value: 7,
          unit: 'px',
        },
        blurRadius: {
          value: 17,
          unit: 'px',
        },
        spreadRadius: {
          value: 28,
          unit: 'px',
        },
        color: {
          model: 'hsb',
          alpha: 0.51,
          hue: 252.71,
          saturation: 79.85,
          brightness: 74.35,
        },
        type: 'inner',
      },
    },
  },
  {
    $type: 'shadows',
    $value: {
      default: [
        {
          offsetX: {
            value: 18,
            unit: 'px',
          },
          offsetY: {
            value: 15,
            unit: 'px',
          },
          blurRadius: {
            value: 3,
            unit: 'px',
          },
          spreadRadius: {
            value: 21,
            unit: 'px',
          },
          color: {
            model: 'rgb',
            alpha: 0.28,
            red: 1,
            green: 55,
            blue: 72,
          },
          type: 'inner',
        },
        {
          offsetX: {
            value: 17,
            unit: 'px',
          },
          offsetY: {
            value: 30,
            unit: 'px',
          },
          blurRadius: {
            value: 26,
            unit: 'px',
          },
          spreadRadius: {
            value: 3,
            unit: 'px',
          },
          color: {
            model: 'hex',
            alpha: 0.35,
            hex: '#574453',
          },
          type: 'inner',
        },
      ],
    },
  },
  {
    $type: 'shadowType',
    $value: {
      default: 'inner',
    },
  },
  {
    $type: 'spacing',
    $value: {
      default: {
        value: 46,
        unit: 'svmin',
      },
    },
  },
  {
    $type: 'spacings',
    $value: {
      default: [
        {
          value: 55,
          unit: 'pc',
        },
        {
          value: 8,
          unit: 'dvb',
        },
        {
          value: 42,
          unit: 'dvb',
        },
        {
          value: 49,
          unit: 'pc',
        },
      ],
    },
  },
  {
    $type: 'stepsTimingFunction',
    $value: {
      default: {
        stepsCount: 10,
        jumpTerm: 'jump-end',
      },
    },
  },
  {
    $type: 'textAlignHorizontal',
    $value: {
      default: 'left',
    },
  },
  {
    $type: 'textAlignVertical',
    $value: {
      default: 'sub',
    },
  },
  {
    $type: 'textDecoration',
    $value: {
      default: 'underline',
    },
  },
  {
    $type: 'textStyle',
    $value: {
      default: {
        font: {
          family: 'Calibri',
          postScriptName: 'Calibri_postScriptName',
          weight: 600,
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
          value: 20,
          unit: 'px',
        },
        color: null,
        fontFeatures: null,
        lineHeight: null,
        letterSpacing: null,
        paragraphSpacing: null,
        textAlignHorizontal: null,
        textAlignVertical: null,
        textDecoration: null,
        textIndent: null,
        textTransform: null,
      },
    },
  },
  {
    $type: 'textTransform',
    $value: {
      default: 'lowercase',
    },
  },
  {
    $type: 'transition',
    $value: {
      default: {
        duration: {
          value: 250,
          unit: 'ms',
        },
        delay: {
          value: 125,
          unit: 'ms',
        },
        timingFunction: [0.20282747403427392, -1, 0.9697411674570271, -1],
      },
    },
  },
  {
    $type: 'vector',
    $value: {
      default: {
        url: 'https://sdtf.specifyapp.com/rmnDRLtX1GIO',
        format: 'svg',
        variationLabel: null,
        provider: 'Specify',
      },
    },
  },
  {
    $type: 'vectorFormat',
    $value: {
      default: 'svg',
    },
  },
  {
    $type: 'vectors',
    $value: {
      default: {
        files: [
          {
            url: 'https://sdtf.specifyapp.com/rmnDRLtX1GIO',
            format: 'svg',
            variationLabel: null,
            provider: 'Specify',
          },
          {
            url: 'https://sdtf.specifyapp.com/rmnDRLtX1GIO',
            format: 'svg',
            variationLabel: 'label',
            provider: 'external',
          },
        ],
      },
    },
  },
  {
    $type: 'zIndex',
    $value: {
      default: 183,
    },
  },
];
