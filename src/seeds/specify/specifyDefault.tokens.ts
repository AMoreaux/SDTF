import { SpecifyDesignTokenFormat } from '../../definitions/index.js';

export const specifyDefaultSeed: SpecifyDesignTokenFormat = {
  primitive: {
    $description: 'Private primitives values',
    space: {
      '1': {
        $type: 'spacing',
        $value: {
          default: { value: 0, unit: 'px' },
        },
      },
      '2': {
        $type: 'spacing',
        $value: {
          default: { value: 2, unit: 'px' },
        },
      },
      '3': {
        $type: 'spacing',
        $value: {
          default: { value: 4, unit: 'px' },
        },
      },
      '4': {
        $type: 'spacing',
        $value: {
          default: { value: 6, unit: 'px' },
        },
      },
      '5': {
        $type: 'spacing',
        $value: {
          default: { value: 8, unit: 'px' },
        },
      },
      '6': {
        $type: 'spacing',
        $value: {
          default: { value: 12, unit: 'px' },
        },
      },
      '7': {
        $type: 'spacing',
        $value: {
          default: { value: 16, unit: 'px' },
        },
      },
      '8': {
        $type: 'spacing',
        $value: {
          default: { value: 24, unit: 'px' },
        },
      },
      '9': {
        $type: 'spacing',
        $value: {
          default: { value: 32, unit: 'px' },
        },
      },
      '10': {
        $type: 'spacing',
        $value: {
          default: { value: 48, unit: 'px' },
        },
      },
      '11': {
        $type: 'spacing',
        $value: {
          default: { value: 64, unit: 'px' },
        },
      },
      '12': {
        $type: 'spacing',
        $value: {
          default: { value: 96, unit: 'px' },
        },
      },
    },
    font: {
      interRegular: {
        $type: 'font',
        $value: {
          default: {
            family: 'Inter',
            postScriptName: 'Inter Regular',
            weight: 'regular',
            style: 'normal',
            files: [
              {
                format: 'ttf',
                url: 'https://static.specifyapp.com/sdtf-seeds/inter-regular.ttf',
                provider: 'Specify',
              },
            ],
          },
        },
      },
      interMedium: {
        $type: 'font',
        $value: {
          default: {
            family: 'Inter',
            postScriptName: 'Inter Medium',
            weight: 'medium',
            style: 'normal',
            files: [
              {
                format: 'ttf',
                url: 'https://static.specifyapp.com/sdtf-seeds/inter-medium.ttf',
                provider: 'Specify',
              },
            ],
          },
        },
      },
      interBold: {
        $type: 'font',
        $value: {
          default: {
            family: 'Inter',
            postScriptName: 'Inter Bold',
            weight: 'bold',
            style: 'normal',
            files: [
              {
                format: 'ttf',
                url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                provider: 'Specify',
              },
            ],
          },
        },
      },
      firaCodeRegular: {
        $type: 'font',
        $value: {
          default: {
            family: 'Fira Code',
            postScriptName: 'Fira Code Regular',
            weight: 'regular',
            style: 'normal',
            files: [
              {
                format: 'ttf',
                url: 'https://static.specifyapp.com/sdtf-seeds/fira-code-regular.ttf',
                provider: 'Specify',
              },
            ],
          },
        },
      },
    },
    contextualColor: {
      $collection: {
        $modes: ['Light', 'Dark'],
      },

      appViolet: {
        base: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 98,
              green: 77,
              blue: 227,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 98,
              green: 77,
              blue: 227,
              alpha: 1,
            },
          },
        },
        dark: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 154,
              green: 144,
              blue: 223,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 73,
              green: 56,
              blue: 195,
              alpha: 1,
            },
          },
        },
        light: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 84,
              green: 67,
              blue: 188,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 138,
              green: 120,
              blue: 238,
              alpha: 1,
            },
          },
        },
        lighter: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 54,
              green: 42,
              blue: 121,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 231,
              green: 228,
              blue: 251,
              alpha: 1,
            },
          },
        },
      },

      blue: {
        base: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 96,
              green: 168,
              blue: 250,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 17,
              green: 125,
              blue: 249,
              alpha: 1,
            },
          },
        },
        lighter: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 41,
              green: 52,
              blue: 67,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 219,
              green: 236,
              blue: 254,
              alpha: 1,
            },
          },
        },
      },
      green: {
        base: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 125,
              green: 216,
              blue: 121,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 88,
              green: 205,
              blue: 82,
              alpha: 1,
            },
          },
        },
        lighter: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 45,
              green: 60,
              blue: 48,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 230,
              green: 247,
              blue: 229,
              alpha: 1,
            },
          },
        },
      },
      orange: {
        base: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 255,
              green: 158,
              blue: 41,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 255,
              green: 142,
              blue: 5,
              alpha: 1,
            },
          },
        },
        light: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 105,
              green: 82,
              blue: 58,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 255,
              green: 223,
              blue: 184,
              alpha: 1,
            },
          },
        },
        lighter: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 65,
              green: 51,
              blue: 36,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 255,
              green: 244,
              blue: 230,
              alpha: 1,
            },
          },
        },
      },
      red: {
        base: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 221,
              green: 72,
              blue: 64,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 245,
              green: 72,
              blue: 63,
              alpha: 1,
            },
          },
        },
        dark: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 227,
              green: 105,
              blue: 99,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 219,
              green: 38,
              blue: 44,
              alpha: 1,
            },
          },
        },
        light: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 183,
              green: 64,
              blue: 58,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 255,
              green: 113,
              blue: 92,
              alpha: 1,
            },
          },
        },
        lighter: {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 60,
              green: 38,
              blue: 39,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 254,
              green: 228,
              blue: 226,
              alpha: 1,
            },
          },
        },
      },

      neutral: {
        '1': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 31,
              green: 32,
              blue: 35,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 255,
              green: 255,
              blue: 255,
              alpha: 1,
            },
          },
        },
        '2': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 39,
              green: 40,
              blue: 43,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 246,
              green: 248,
              blue: 251,
              alpha: 1,
            },
          },
        },
        '3': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 49,
              green: 50,
              blue: 53,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 222,
              green: 228,
              blue: 237,
              alpha: 1,
            },
          },
        },
        '4': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 68,
              green: 71,
              blue: 75,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 204,
              green: 213,
              blue: 225,
              alpha: 1,
            },
          },
        },
        '5': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 92,
              green: 96,
              blue: 102,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 179,
              green: 192,
              blue: 208,
              alpha: 1,
            },
          },
        },
        '6': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 120,
              green: 126,
              blue: 135,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 120,
              green: 139,
              blue: 165,
              alpha: 1,
            },
          },
        },
        '7': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 174,
              green: 178,
              blue: 183,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 92,
              green: 111,
              blue: 138,
              alpha: 1,
            },
          },
        },
        '8': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 244,
              green: 245,
              blue: 245,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 50,
              green: 59,
              blue: 72,
              alpha: 1,
            },
          },
        },
        '9': {
          $type: 'color',
          $value: {
            Dark: {
              model: 'rgb',
              red: 255,
              green: 255,
              blue: 255,
              alpha: 1,
            },
            Light: {
              model: 'rgb',
              red: 24,
              green: 30,
              blue: 37,
              alpha: 1,
            },
          },
        },
      },
    },
  },
  functional: {
    color: {
      $collection: {
        $modes: ['Light', 'Dark'],
      },
      text: {
        active: {
          $type: 'color',
          $value: {
            Dark: {
              $alias: 'primitive.contextualColor.appViolet.dark',
              $mode: 'Dark',
            },
            Light: {
              $alias: 'primitive.contextualColor.appViolet.base',
              $mode: 'Light',
            },
          },
        },
        error: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.red.base' },
        },
        highEmphasis: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.9' },
        },
        info: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.blue.base' },
        },
        lowEmphasis: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.6' },
        },
        mediumEmphasis: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.8' },
        },
        onColoredBg: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.1' },
        },
        success: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.green.base' },
        },
        warning: {
          $type: 'color',
          $value: {
            $alias: 'primitive.contextualColor.orange.base',
          },
        },
      },
      skeleton: {
        default: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.2' },
        },
      },
      icon: {
        default: {
          $type: 'color',
          $value: {
            $alias: 'primitive.contextualColor.neutral.6',
          },
        },
        disabled: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.4' },
        },
        error: {
          $type: 'color',
          $value: {
            $alias: 'primitive.contextualColor.red.base',
          },
        },
        info: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.blue.base' },
        },
        onColoredBg: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.neutral.1' },
        },
        selected: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.appViolet.base' },
        },
        success: {
          $type: 'color',
          $value: {
            $alias: 'primitive.contextualColor.green.base',
          },
        },
        warning: {
          $type: 'color',
          $value: { $alias: 'primitive.contextualColor.orange.base' },
        },
      },
      surface: {
        background: {
          'marketing-background': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.1',
            },
          },
          overlay: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.9',
            },
          },
          'surface-1': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.1',
            },
          },
          'surface-2': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.2',
            },
          },
          'surface-3': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.3',
            },
          },
          'surface-glass': {
            $type: 'color',
            $value: {
              Dark: {
                model: 'rgb',
                red: 24,
                green: 30,
                blue: 37,
                alpha: 0.800000011920929,
              },
              Light: {
                model: 'rgb',
                red: 255,
                green: 255,
                blue: 255,
                alpha: 0.6399999856948853,
              },
            },
          },
        },
      },
      button: {
        background: {
          'destructive-active': {
            $type: 'color',
            $value: { $alias: 'primitive.contextualColor.red.light' },
          },
          'destructive-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.base',
            },
          },
          'destructive-hover': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.dark',
            },
          },
          'destructive-text-hover': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.lighter',
            },
          },
          'primary-active': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.light',
            },
          },
          'primary-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.base',
            },
          },
          'primary-hover': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.dark',
            },
          },
          'secondary-active': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.3',
            },
          },
          'secondary-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.1',
            },
          },
          'secondary-hover': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.2',
            },
          },
          'warning-active': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.orange.light',
            },
          },
          'warning-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.orange.lighter',
            },
          },
        },
        border: {
          'destructive-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.dark',
            },
          },
          'destructive-focused': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.lighter',
            },
          },
          'primary-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.dark',
            },
          },
          'primary-focused': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.lighter',
            },
          },
          'secondary-default': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.3',
            },
          },
          'warning-hover': {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.orange.light',
            },
          },
        },
      },
      component: {
        background: {
          child: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.2',
            },
          },
          disabled: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.2',
            },
          },
          elevatedElement: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.1',
            },
          },
          error: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.lighter',
            },
          },
          highlight: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.lighter',
            },
          },
          hoverOnDarkest: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.3',
            },
          },
          hoverOnLightest: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.2',
            },
          },
          info: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.blue.lighter',
            },
          },
          input: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.1',
            },
          },
          parent: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.1',
            },
          },
          success: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.green.lighter',
            },
          },
          tooltip: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.9',
            },
          },
          warning: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.orange.lighter',
            },
          },
        },
        border: {
          default: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.4',
            },
          },
          active: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.appViolet.base',
            },
          },
          darkest: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.neutral.7',
            },
          },
          error: {
            $type: 'color',
            $value: {
              $alias: 'primitive.contextualColor.red.base',
            },
          },
          lightest: {
            $type: 'color',
            $value: { $alias: 'primitive.contextualColor.neutral.3' },
          },
        },
      },
    },
    textStyle: {
      $collection: {
        $modes: ['desktop', 'mobile'],
      },
      heading: {
        '1': {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 32,
                unit: 'px',
              },
              lineHeight: {
                value: 40,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 28,
                unit: 'px',
              },
              lineHeight: {
                value: 36,
                unit: 'px',
              },
              fontFeatures: null,
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
        '2': {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 24,
                unit: 'px',
              },
              lineHeight: {
                value: 32,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 22,
                unit: 'px',
              },
              lineHeight: {
                value: 28,
                unit: 'px',
              },
              fontFeatures: null,
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
        '3': {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 20,
                unit: 'px',
              },
              lineHeight: {
                value: 32,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 18,
                unit: 'px',
              },
              lineHeight: {
                value: 28,
                unit: 'px',
              },
              fontFeatures: null,
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
      },
      display: {
        '1': {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 56,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 32,
                unit: 'px',
              },
              lineHeight: {
                value: 40,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
        '2': {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 40,
                unit: 'px',
              },
              lineHeight: {
                value: 48,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interBold', $mode: 'default' },
              color: null,
              fontSize: {
                value: 32,
                unit: 'px',
              },
              lineHeight: {
                value: 40,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      },
      copy: {
        body: {
          '1': {
            $type: 'textStyle',
            $value: {
              desktop: {
                font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
                color: null,
                fontSize: {
                  value: 18,
                  unit: 'px',
                },
                lineHeight: {
                  value: 32,
                  unit: 'px',
                },
                fontFeatures: null,
                letterSpacing: null,
                paragraphSpacing: null,
                textAlignHorizontal: null,
                textAlignVertical: null,
                textDecoration: null,
                textIndent: null,
                textTransform: null,
              },
              mobile: {
                font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
                color: null,
                fontSize: {
                  value: 16,
                  unit: 'px',
                },
                lineHeight: {
                  value: 24,
                  unit: 'px',
                },
                fontFeatures: null,
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
          '2': {
            $type: 'textStyle',
            $value: {
              desktop: {
                font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
                color: null,
                fontSize: {
                  value: 16,
                  unit: 'px',
                },
                lineHeight: {
                  value: 24,
                  unit: 'px',
                },
                fontFeatures: null,
                letterSpacing: null,
                paragraphSpacing: null,
                textAlignHorizontal: null,
                textAlignVertical: null,
                textDecoration: null,
                textIndent: null,
                textTransform: null,
              },
              mobile: {
                font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
                color: null,
                fontSize: {
                  value: 14,
                  unit: 'px',
                },
                lineHeight: {
                  value: 32,
                  unit: 'px',
                },
                fontFeatures: null,
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
          '3': {
            $type: 'textStyle',
            $value: {
              desktop: {
                font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
                color: null,
                fontSize: {
                  value: 14,
                  unit: 'px',
                },
                lineHeight: {
                  value: 24,
                  unit: 'px',
                },
                fontFeatures: null,
                letterSpacing: null,
                paragraphSpacing: null,
                textAlignHorizontal: null,
                textAlignVertical: null,
                textDecoration: null,
                textIndent: null,
                textTransform: null,
              },
              mobile: {
                font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
                color: null,
                fontSize: {
                  value: 14,
                  unit: 'px',
                },
                lineHeight: {
                  value: 24,
                  unit: 'px',
                },
                fontFeatures: null,
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
        },
        label: {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interMedium', $mode: 'default' },
              color: null,
              fontSize: {
                value: 12,
                unit: 'px',
              },
              lineHeight: {
                value: 20,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 1.2,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
              color: null,
              fontSize: {
                value: 12,
                unit: 'px',
              },
              lineHeight: {
                value: 20,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0.4,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
        code: {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.firaCodeRegular', $mode: 'default' },
              color: null,
              fontSize: {
                value: 14,
                unit: 'px',
              },
              lineHeight: {
                value: 20,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.firaCodeRegular', $mode: 'default' },
              color: null,
              fontSize: {
                value: 14,
                unit: 'px',
              },
              lineHeight: {
                value: 20,
                unit: 'px',
              },
              fontFeatures: null,
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
        footnote: {
          $type: 'textStyle',
          $value: {
            desktop: {
              font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
              color: null,
              fontSize: {
                value: 14,
                unit: 'px',
              },
              lineHeight: {
                value: 24,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
            mobile: {
              font: { $alias: 'primitive.font.interRegular', $mode: 'default' },
              color: null,
              fontSize: {
                value: 14,
                unit: 'px',
              },
              lineHeight: {
                value: 24,
                unit: 'px',
              },
              fontFeatures: null,
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
      },
    },
    elevation: {
      background: {
        $type: 'zIndex',
        $value: {
          default: 0,
        },
      },
      foreground: {
        $type: 'zIndex',
        $value: {
          default: 1,
        },
      },
      panel: {
        $type: 'zIndex',
        $value: {
          default: 5,
        },
      },
      modal: {
        $type: 'zIndex',
        $value: {
          default: 10,
        },
      },
    },
    shadow: {
      focusRing: {
        $type: 'shadow',
        $value: {
          default: {
            type: 'outer',
            color: {
              model: 'rgb',
              red: 231,
              green: 228,
              blue: 251,
              alpha: 1,
            },
            offsetX: {
              value: 0,
              unit: 'px',
            },
            offsetY: {
              value: 0,
              unit: 'px',
            },
            blurRadius: {
              value: 0,
              unit: 'px',
            },
            spreadRadius: {
              value: 3,
              unit: 'px',
            },
          },
        },
      },
      elevatedElement: {
        $type: 'shadows',
        $value: {
          default: [
            {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0.02,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 1,
                unit: 'px',
              },
              blurRadius: {
                value: 2,
                unit: 'px',
              },
              spreadRadius: {
                value: 0,
                unit: 'px',
              },
            },
            {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0.04,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 2,
                unit: 'px',
              },
              blurRadius: {
                value: 2,
                unit: 'px',
              },
              spreadRadius: {
                value: 0,
                unit: 'px',
              },
            },
          ],
        },
      },
      modal: {
        $type: 'shadows',
        $value: {
          default: [
            {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0.08,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 4,
                unit: 'px',
              },
              blurRadius: {
                value: 8,
                unit: 'px',
              },
              spreadRadius: {
                value: 0,
                unit: 'px',
              },
            },
            {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0.16,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 12,
                unit: 'px',
              },
              blurRadius: {
                value: 24,
                unit: 'px',
              },
              spreadRadius: {
                value: 0,
                unit: 'px',
              },
            },
          ],
        },
      },
    },
    breakpoint: {
      desktop: {
        $type: 'dimension',
        $value: { default: { value: 1400, unit: 'px' } },
      },
      phone: {
        $type: 'dimension',
        $value: { default: { value: 390, unit: 'px' } },
      },
      tabletLandscape: {
        $type: 'dimension',
        $value: { default: { value: 1200, unit: 'px' } },
      },
      tabletPortrait: {
        $type: 'dimension',
        $value: { default: { value: 780, unit: 'px' } },
      },
    },
    radius: {
      xSmall: {
        $type: 'radius',
        $value: { default: { value: 4, unit: 'px' } },
      },
      small: {
        $type: 'radius',
        $value: { default: { value: 6, unit: 'px' } },
      },
      medium: {
        $type: 'radius',
        $value: { default: { value: 8, unit: 'px' } },
      },
      large: {
        $type: 'radius',
        $value: { default: { value: 12, unit: 'px' } },
      },
      xLarge: {
        $type: 'radius',
        $value: { default: { value: 16, unit: 'px' } },
      },
      xxLarge: {
        $type: 'radius',
        $value: { default: { value: 24, unit: 'px' } },
      },
    },
    blur: {
      contentBehindModal: {
        $type: 'blur',
        $value: { default: { value: 4, unit: 'px' } },
      },
      frostedIllustration: {
        $type: 'blur',
        $value: { default: { value: 8, unit: 'px' } },
      },
    },
    opacity: {
      disabled: {
        $type: 'opacity',
        $value: { default: 0.4 },
      },
      contentBehindModal: {
        $type: 'opacity',
        $value: { default: 0.8 },
      },
    },
    gradient: {
      skeleton: {
        $type: 'gradient',
        $value: {
          default: {
            type: 'linear',
            angle: 90,
            colorStops: [
              {
                position: 0,
                color: {
                  $alias: 'primitive.contextualColor.neutral.1',
                  $mode: 'Light',
                },
              },
              {
                position: 0.5,
                color: {
                  $alias: 'primitive.contextualColor.neutral.3',
                  $mode: 'Light',
                },
              },
              {
                position: 1,
                color: {
                  $alias: 'primitive.contextualColor.neutral.1',
                  $mode: 'Light',
                },
              },
            ],
          },
        },
      },
    },
    duration: {
      small: {
        $type: 'duration',
        $value: { default: { value: 100, unit: 'ms' } },
      },
      medium: {
        $type: 'duration',
        $value: { default: { value: 200, unit: 'ms' } },
      },
      large: {
        $type: 'duration',
        $value: { default: { value: 400, unit: 'ms' } },
      },
      xLarge: {
        $type: 'duration',
        $value: { default: { value: 800, unit: 'ms' } },
      },
    },
    cubicBezier: {
      standard: {
        $type: 'cubicBezier',
        $value: {
          default: [0.2, 0, 0, 1],
        },
      },
      emphasized: {
        $type: 'cubicBezier',
        $value: {
          default: [0.05, 0.7, 0.1, 1],
        },
      },
    },
    transition: {
      actionStateChange: {
        $type: 'transition',
        $value: {
          default: {
            delay: { value: 0, unit: 'ms' },
            duration: { $alias: 'functional.duration.small', $mode: 'default' },
            timingFunction: { $alias: 'functional.cubicBezier.standard', $mode: 'default' },
          },
        },
      },
      overlayEnter: {
        $type: 'transition',
        $value: {
          default: {
            delay: { value: 0, unit: 'ms' },
            duration: { $alias: 'functional.duration.xLarge', $mode: 'default' },
            timingFunction: { $alias: 'functional.cubicBezier.emphasized', $mode: 'default' },
          },
        },
      },
      overlayLeave: {
        $type: 'transition',
        $value: {
          default: {
            delay: { value: 0, unit: 'ms' },
            duration: { $alias: 'functional.duration.xLarge', $mode: 'default' },
            timingFunction: { $alias: 'functional.cubicBezier.emphasized', $mode: 'default' },
          },
        },
      },
    },

    avatarSize: {
      small: {
        $type: 'dimension',
        $value: { default: { value: 16, unit: 'px' } },
      },
      medium: {
        $type: 'dimension',
        $value: { default: { value: 32, unit: 'px' } },
      },
      large: {
        $type: 'dimension',
        $value: { default: { value: 48, unit: 'px' } },
      },
    },

    cardElement: {
      border: {
        $type: 'border',
        $value: {
          default: {
            color: {
              $alias: 'functional.color.component.border.default',
              $mode: 'Light',
            },
            width: {
              value: 1,
              unit: 'px',
            },
            style: 'solid',
            rectangleCornerRadii: null,
          },
        },
      },
    },
  },
  asset: {
    bitmap: {
      background: {
        '1': {
          $type: 'bitmap',
          $value: {
            default: {
              variationLabel: '@2x',
              format: 'jpg',
              url: 'https://static.specifyapp.com/sdtf-seeds/space-1.jpg',
              width: 800,
              height: 400,
              provider: 'Specify',
            },
          },
        },
        '2': {
          $type: 'bitmap',
          $value: {
            default: {
              variationLabel: '@2x',
              format: 'jpg',
              url: 'https://static.specifyapp.com/sdtf-seeds/space-2.jpg',
              width: 800,
              height: 400,
              provider: 'Specify',
            },
          },
        },
        '3': {
          $type: 'bitmap',
          $value: {
            default: {
              variationLabel: '@2x',
              format: 'jpg',
              url: 'https://static.specifyapp.com/sdtf-seeds/space-3.jpg',
              width: 800,
              height: 400,
              provider: 'Specify',
            },
          },
        },
      },
    },
    icon: {
      array: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/array.svg',
            provider: 'Specify',
          },
        },
      },
      boolean: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/boolean.svg',
            provider: 'Specify',
          },
        },
      },
      border: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/border.svg',
            provider: 'Specify',
          },
        },
      },
      color: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/color.svg',
            provider: 'Specify',
          },
        },
      },
      depth: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/depth.svg',
            provider: 'Specify',
          },
        },
      },
      dimension: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/dimension.svg',
            provider: 'Specify',
          },
        },
      },
      font: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/font.svg',
            provider: 'Specify',
          },
        },
      },
      'variable-font': {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/variable-font.svg',
            provider: 'Specify',
          },
        },
      },
      gradient: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/gradient.svg',
            provider: 'Specify',
          },
        },
      },
      image: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/image.svg',
            provider: 'Specify',
          },
        },
      },
      measurement: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/measurement.svg',
            provider: 'Specify',
          },
        },
      },
      null: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/null.svg',
            provider: 'Specify',
          },
        },
      },
      opacity: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/opacity.svg',
            provider: 'Specify',
          },
        },
      },
      radii: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/radii.svg',
            provider: 'Specify',
          },
        },
      },
      sandglass: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/sandglass.svg',
            provider: 'Specify',
          },
        },
      },
      shadow: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/shadow.svg',
            provider: 'Specify',
          },
        },
      },
      text: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/text.svg',
            provider: 'Specify',
          },
        },
      },
      transition: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/transition.svg',
            provider: 'Specify',
          },
        },
      },
      vector: {
        $type: 'vector',
        $value: {
          default: {
            variationLabel: null,
            format: 'svg',
            url: 'https://static.specifyapp.com/sdtf-seeds/vector.svg',
            provider: 'Specify',
          },
        },
      },
    },
  },
  content: {
    $collection: {
      $modes: ['English', 'Spanish', 'French'],
    },
    action: {
      cancel: {
        $type: 'string',
        $value: {
          French: 'Annuler',
          English: 'Cancel',
          Spanish: 'Cancelar',
        },
      },
      confirm: {
        $type: 'string',
        $value: {
          French: 'Confirmer',
          English: 'Confirm',
          Spanish: 'Confirme',
        },
      },
      delete: {
        $type: 'string',
        $value: {
          French: 'Supprimer',
          English: 'Delete',
          Spanish: 'Borrar',
        },
      },
      next: {
        $type: 'string',
        $value: {
          French: 'Continuer',
          English: 'Continue',
          Spanish: 'Contin�e en',
        },
      },
    },
    copy: {
      headline: {
        $type: 'string',
        $value: {
          French: 'Automatisez la distribution de vos jetons de conception',
          English: 'Automate the distribution of your design tokens',
          Spanish: 'Automatice la distribucion de sus fichas de diseo',
        },
      },
      description: {
        $type: 'string',
        $value: {
          French:
            'Ameliorez votre systeme de conception en creant votre propre source de verite, ameliorez la collaboration entre la conception et le developpement et reduisez le travail manuel.',
          English:
            'Enhance your design system by creating your own source of truth, improve collaboration between design and development and reduce manual work.',
          Spanish:
            'Mejore su sistema de dise�o creando su propia fuente de verdad, mejore la colaboracion entre dise�o y desarrollo y reduzca el trabajo manual.',
        },
      },
    },
    label: {
      destination: {
        $type: 'string',
        $value: {
          French: 'Destination',
          English: 'Destination',
          Spanish: 'Destino',
        },
      },
      repository: {
        $type: 'string',
        $value: {
          French: 'Repostiory',
          English: 'Repostiory',
          Spanish: 'Repositorio',
        },
      },
      source: {
        $type: 'string',
        $value: {
          French: 'Source',
          English: 'Source',
          Spanish: 'Fuente',
        },
      },
      token: {
        $type: 'string',
        $value: {
          French: 'Jeton',
          English: 'Token',
          Spanish: 'Ficha',
        },
      },
    },
  },
};
