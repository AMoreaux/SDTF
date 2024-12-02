import { SpecifyDesignTokenFormat } from '../../definitions/index.js';

export const openColorSeed: SpecifyDesignTokenFormat = {
  primitive: {
    color: {
      $description:
        'Open Color is an open-source color scheme optimized for UI like font, background, border, etc. — https://yeun.github.io/open-color/',
      white: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffffff', alpha: 1 } } },
      black: { $type: 'color', $value: { default: { model: 'hex', hex: '#000000', alpha: 1 } } },
      gray: {
        0: { $type: 'color', $value: { default: { model: 'hex', hex: '#f8f9fa', alpha: 1 } } },
        1: { $type: 'color', $value: { default: { model: 'hex', hex: '#f1f3f5', alpha: 1 } } },
        2: { $type: 'color', $value: { default: { model: 'hex', hex: '#e9ecef', alpha: 1 } } },
        3: { $type: 'color', $value: { default: { model: 'hex', hex: '#dee2e6', alpha: 1 } } },
        4: { $type: 'color', $value: { default: { model: 'hex', hex: '#ced4da', alpha: 1 } } },
        5: { $type: 'color', $value: { default: { model: 'hex', hex: '#adb5bd', alpha: 1 } } },
        6: { $type: 'color', $value: { default: { model: 'hex', hex: '#868e96', alpha: 1 } } },
        7: { $type: 'color', $value: { default: { model: 'hex', hex: '#495057', alpha: 1 } } },
        8: { $type: 'color', $value: { default: { model: 'hex', hex: '#343a40', alpha: 1 } } },
        9: { $type: 'color', $value: { default: { model: 'hex', hex: '#212529', alpha: 1 } } },
      },
      red: {
        0: { $type: 'color', $value: { default: { model: 'hex', hex: '#fff5f5', alpha: 1 } } },
        1: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffe3e3', alpha: 1 } } },
        2: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffc9c9', alpha: 1 } } },
        3: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffa8a8', alpha: 1 } } },
        4: { $type: 'color', $value: { default: { model: 'hex', hex: '#ff8787', alpha: 1 } } },
        5: { $type: 'color', $value: { default: { model: 'hex', hex: '#ff6b6b', alpha: 1 } } },
        6: { $type: 'color', $value: { default: { model: 'hex', hex: '#fa5252', alpha: 1 } } },
        7: { $type: 'color', $value: { default: { model: 'hex', hex: '#f03e3e', alpha: 1 } } },
        8: { $type: 'color', $value: { default: { model: 'hex', hex: '#e03131', alpha: 1 } } },
        9: { $type: 'color', $value: { default: { model: 'hex', hex: '#c92a2a', alpha: 1 } } },
      },
      blue: {
        0: { $type: 'color', $value: { default: { model: 'hex', hex: '#e7f5ff', alpha: 1 } } },
        1: { $type: 'color', $value: { default: { model: 'hex', hex: '#d0ebff', alpha: 1 } } },
        2: { $type: 'color', $value: { default: { model: 'hex', hex: '#a5d8ff', alpha: 1 } } },
        3: { $type: 'color', $value: { default: { model: 'hex', hex: '#74c0fc', alpha: 1 } } },
        4: { $type: 'color', $value: { default: { model: 'hex', hex: '#4dabf7', alpha: 1 } } },
        5: { $type: 'color', $value: { default: { model: 'hex', hex: '#339af0', alpha: 1 } } },
        6: { $type: 'color', $value: { default: { model: 'hex', hex: '#228be6', alpha: 1 } } },
        7: { $type: 'color', $value: { default: { model: 'hex', hex: '#1c7ed6', alpha: 1 } } },
        8: { $type: 'color', $value: { default: { model: 'hex', hex: '#1971c2', alpha: 1 } } },
        9: { $type: 'color', $value: { default: { model: 'hex', hex: '#1864ab', alpha: 1 } } },
      },
      green: {
        0: { $type: 'color', $value: { default: { model: 'hex', hex: '#ebfbee', alpha: 1 } } },
        1: { $type: 'color', $value: { default: { model: 'hex', hex: '#d3f9d8', alpha: 1 } } },
        2: { $type: 'color', $value: { default: { model: 'hex', hex: '#b2f2bb', alpha: 1 } } },
        3: { $type: 'color', $value: { default: { model: 'hex', hex: '#8ce99a', alpha: 1 } } },
        4: { $type: 'color', $value: { default: { model: 'hex', hex: '#69db7c', alpha: 1 } } },
        5: { $type: 'color', $value: { default: { model: 'hex', hex: '#51cf66', alpha: 1 } } },
        6: { $type: 'color', $value: { default: { model: 'hex', hex: '#40c057', alpha: 1 } } },
        7: { $type: 'color', $value: { default: { model: 'hex', hex: '#37b24d', alpha: 1 } } },
        8: { $type: 'color', $value: { default: { model: 'hex', hex: '#2f9e44', alpha: 1 } } },
        9: { $type: 'color', $value: { default: { model: 'hex', hex: '#2b8a3e', alpha: 1 } } },
      },
      orange: {
        0: { $type: 'color', $value: { default: { model: 'hex', hex: '#fff4e6', alpha: 1 } } },
        1: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffe8cc', alpha: 1 } } },
        2: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffd8a8', alpha: 1 } } },
        3: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffc078', alpha: 1 } } },
        4: { $type: 'color', $value: { default: { model: 'hex', hex: '#ffa94d', alpha: 1 } } },
        5: { $type: 'color', $value: { default: { model: 'hex', hex: '#ff922b', alpha: 1 } } },
        6: { $type: 'color', $value: { default: { model: 'hex', hex: '#fd7e14', alpha: 1 } } },
        7: { $type: 'color', $value: { default: { model: 'hex', hex: '#f76707', alpha: 1 } } },
        8: { $type: 'color', $value: { default: { model: 'hex', hex: '#e8590c', alpha: 1 } } },
        9: { $type: 'color', $value: { default: { model: 'hex', hex: '#d9480f', alpha: 1 } } },
      },
    },
  },
  themedColor: {
    $collection: {
      $modes: ['light', 'dark'],
    },
    surface: {
      1: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.gray.0', $mode: 'default' },
          dark: { $alias: 'primitive.color.gray.9', $mode: 'default' },
        },
      },
      2: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.gray.1', $mode: 'default' },
          dark: { $alias: 'primitive.color.gray.8', $mode: 'default' },
        },
      },
      3: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.gray.2', $mode: 'default' },
          dark: { $alias: 'primitive.color.gray.7', $mode: 'default' },
        },
      },
      error: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.red.4', $mode: 'default' },
          dark: { $alias: 'primitive.color.red.7', $mode: 'default' },
        },
      },
      warning: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.orange.4', $mode: 'default' },
          dark: { $alias: 'primitive.color.orange.7', $mode: 'default' },
        },
      },
      success: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.green.4', $mode: 'default' },
          dark: { $alias: 'primitive.color.green.7', $mode: 'default' },
        },
      },
      information: {
        $type: 'color',
        $value: {
          light: { $alias: 'primitive.color.blue.4', $mode: 'default' },
          dark: { $alias: 'primitive.color.blue.7', $mode: 'default' },
        },
      },
    },
    text: {
      lowEmphasis: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.gray.6', $mode: 'default' },
            dark: { $alias: 'primitive.color.gray.4', $mode: 'default' },
          },
        },
      },
      mediumEmphasis: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.gray.7', $mode: 'default' },
            dark: { $alias: 'primitive.color.gray.3', $mode: 'default' },
          },
        },
        hover: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.gray.8', $mode: 'default' },
            dark: { $alias: 'primitive.color.gray.2', $mode: 'default' },
          },
        },
      },
      highEmphasis: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.gray.9', $mode: 'default' },
            dark: { $alias: 'primitive.color.gray.0', $mode: 'default' },
          },
        },
        hover: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.gray.8', $mode: 'default' },
            dark: { $alias: 'primitive.color.gray.1', $mode: 'default' },
          },
        },
        active: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.gray.7', $mode: 'default' },
            dark: { $alias: 'primitive.color.gray.2', $mode: 'default' },
          },
        },
      },
      error: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.red.7', $mode: 'default' },
            dark: { $alias: 'primitive.color.red.6', $mode: 'default' },
          },
        },
        hover: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.red.6', $mode: 'default' },
            dark: { $alias: 'primitive.color.red.5', $mode: 'default' },
          },
        },
      },
      warning: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.orange.7', $mode: 'default' },
            dark: { $alias: 'primitive.color.orange.6', $mode: 'default' },
          },
        },
        hover: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.orange.6', $mode: 'default' },
            dark: { $alias: 'primitive.color.orange.5', $mode: 'default' },
          },
        },
      },
      success: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.green.7', $mode: 'default' },
            dark: { $alias: 'primitive.color.green.6', $mode: 'default' },
          },
        },
        hover: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.green.6', $mode: 'default' },
            dark: { $alias: 'primitive.color.green.5', $mode: 'default' },
          },
        },
      },
      information: {
        default: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.blue.7', $mode: 'default' },
            dark: { $alias: 'primitive.color.blue.6', $mode: 'default' },
          },
        },
        hover: {
          $type: 'color',
          $value: {
            light: { $alias: 'primitive.color.blue.6', $mode: 'default' },
            dark: { $alias: 'primitive.color.blue.5', $mode: 'default' },
          },
        },
      },
    },
  },
};
