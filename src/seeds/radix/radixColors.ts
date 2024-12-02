import { SpecifyDesignTokenFormat } from '../../definitions/index.js';

/* ------------------------------------------
   Conversion business logic
---------------------------------------------
function makeToken(lightValue: string, darkValue: string) {
  return {
    $type: 'color',
    $value: {
      light: {
        model: 'hex',
        hex: lightValue,
        alpha: 1,
      },
      dark: {
        model: 'hex',
        hex: darkValue,
        alpha: 1,
      },
    },
  };
}
const regex = /\d+/;
const sdtfTokens = allColors
  .map(color => {
    const [light, dark] = color;
    const lightKeys = Object.keys(light);
    const colorShade = lightKeys.reduce((acc, key) => {
      const matched = regex.exec(key);
      // @ts-ignore
      acc[matched[0]] = makeToken(light[key], dark[key]);
      return acc;
    }, {});
    const colorKey = lightKeys[0].replace('1', '');
    return [colorKey, colorShade];
  })
  .reduce((acc, [colorKey, color]) => {
    // @ts-ignore
    acc[colorKey] = color;
    return acc;
  }, {});

 */

/**
 * Subset dataset from https://www.radix-ui.com/colors
 */
export const radixColorsSeed: SpecifyDesignTokenFormat = {
  radixColors: {
    $description: 'Subset dataset from https://www.radix-ui.com/colors',
    $collection: {
      $modes: ['light', 'dark'],
    },
    gray: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fcfcfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111111',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f9f9f9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#191919',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f0f0f0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#222222',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e8e8e8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2a2a2a',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e0e0e0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#313131',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d9d9d9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3a3a3a',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cecece',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#484848',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#bbbbbb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#606060',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8d8d8d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6e6e6e',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#838383',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7b7b7b',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#646464',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b4b4b4',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#202020',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#eeeeee',
            alpha: 1,
          },
        },
      },
    },
    mauve: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfcfd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#121113',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#faf9fb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1a191b',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f2eff3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#232225',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eae7ec',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2b292d',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e3dfe6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#323035',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dbd8e0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3c393f',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d0cdd7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#49474e',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#bcbac7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#625f69',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8e8c99',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6f6d78',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#84828e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7c7a85',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#65636d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b5b2bc',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#211f26',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#eeeef0',
            alpha: 1,
          },
        },
      },
    },
    slate: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fcfcfd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111113',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f9f9fb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#18191b',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f0f0f3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#212225',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e8e8ec',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#272a2d',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e0e1e6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2e3135',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d9d9e0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#363a3f',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cdced6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#43484e',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b9bbc6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5a6169',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8b8d98',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#696e77',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#80838d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#777b84',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#60646c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b0b4ba',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#1c2024',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#edeef0',
            alpha: 1,
          },
        },
      },
    },
    sage: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbfdfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#101211',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f7f9f8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#171918',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eef1f0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#202221',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e6e9e8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#272a29',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dfe2e0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2e3130',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d7dad9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#373b39',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cbcfcd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#444947',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b8bcba',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5b625f',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#868e8b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#63706b',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7c8481',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#717d79',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5f6563',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#adb5b2',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#1a211e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#eceeed',
            alpha: 1,
          },
        },
      },
    },
    olive: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fcfdfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111210',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f8faf8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#181917',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eff1ef',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#212220',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e7e9e7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#282a27',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dfe2df',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2f312e',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d7dad7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#383a36',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cccfcc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#454843',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b9bcb8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5c625b',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#898e87',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#687066',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7f847d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#767d74',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#60655f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#afb5ad',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#1d211c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#eceeec',
            alpha: 1,
          },
        },
      },
    },
    sand: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfdfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111110',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f9f9f8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#191918',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f1f0ef',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#222221',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e9e8e6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2a2a28',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e2e1de',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#31312e',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dad9d6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3b3a37',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cfceca',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#494844',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#bcbbb5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#62605b',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8d8d86',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6f6d66',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#82827c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7c7b74',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#63635e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b5b3ad',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#21201c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#eeeeec',
            alpha: 1,
          },
        },
      },
    },
    tomato: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fffcfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#181111',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fff8f7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1f1513',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#feebe7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#391714',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffdcd3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4e1511',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffcdc2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5e1c16',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdbdaf',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6e2920',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f5a898',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#853a2d',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ec8e7b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ac4d39',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e54d2e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e54d2e',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dd4425',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ec6142',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d13415',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ff977d',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5c271f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#fbd3cb',
            alpha: 1,
          },
        },
      },
    },
    red: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fffcfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#191111',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fff7f7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#201314',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#feebec',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3b1219',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffdbdc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#500f1c',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffcdce',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#611623',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdbdbe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#72232d',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f4a9aa',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#8c333a',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eb8e90',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b54548',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e5484d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e5484d',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dc3e42',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ec5d5e',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ce2c31',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ff9592',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#641723',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffd1d9',
            alpha: 1,
          },
        },
      },
    },
    ruby: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fffcfd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#191113',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fff7f8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1e1517',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#feeaed',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3a141e',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffdce1',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4e1325',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffced6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5e1a2e',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f8bfc8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6f2539',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#efacb8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#883447',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e592a3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b3445a',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e54666',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e54666',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dc3b5d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ec5a72',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ca244d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ff949d',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#64172b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#fed2e1',
            alpha: 1,
          },
        },
      },
    },
    crimson: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fffcfd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#191114',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fef7f9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#201318',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffe9f0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#381525',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fedce7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4d122f',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#facedd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5c1839',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f3bed1',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6d2545',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eaacc3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#873356',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e093b2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b0436e',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e93d82',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e93d82',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#df3478',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ee518a',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cb1d63',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ff92ad',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#621639',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#fdd3e8',
            alpha: 1,
          },
        },
      },
    },
    pink: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fffcfe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#191117',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fef7fb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#21121d',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fee9f5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#37172f',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbdcef',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4b143d',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f6cee7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#591c47',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#efbfdd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#692955',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e7acd0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#833869',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dd93c2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#a84885',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d6409f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#d6409f',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cf3897',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#de51a8',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c2298a',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ff8dcc',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#651249',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#fdd1ea',
            alpha: 1,
          },
        },
      },
    },
    plum: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefcff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#181118',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdf7fd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#201320',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbebfb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#351a35',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f7def8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#451d47',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f2d1f3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#512454',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e9c2ec',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5e3061',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#deade3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#734079',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cf91d8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#92549c',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ab4aba',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ab4aba',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#a144af',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b658c4',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#953ea3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e796f3',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#53195d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#f4d4f4',
            alpha: 1,
          },
        },
      },
    },
    purple: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefcfe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#18111b',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbf7fe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1e1523',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f7edfe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#301c3b',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f2e2fc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3d224e',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ead5f9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#48295c',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e0c4f4',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#54346b',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d1afec',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#664282',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#be93e4',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#8457aa',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8e4ec6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#8e4ec6',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8347b9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#9a5cd0',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8145b5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#d19dff',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#402060',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ecd9fa',
            alpha: 1,
          },
        },
      },
    },
    violet: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfcfe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#14121f',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#faf8ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1b1525',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f4f0fe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#291f43',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ebe4ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#33255b',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e1d9ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3c2e69',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d4cafe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#473876',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c2b5f5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#56468b',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#aa99ec',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6958ad',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#6e56cf',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6e56cf',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#654dc4',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7d66d9',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#6550b9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#baa7ff',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#2f265f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e2ddfe',
            alpha: 1,
          },
        },
      },
    },
    iris: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfdff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#13131e',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f8f8ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#171625',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f0f1fe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#202248',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e6e7ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#262a65',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dadcff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#303374',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cbcdff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3d3e82',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b8baf8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4a4a95',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#9b9ef0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5958b1',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5b5bd6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5b5bd6',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5151cd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6e6ade',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5753c6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b1a9ff',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#272962',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e0dffe',
            alpha: 1,
          },
        },
      },
    },
    indigo: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfdfe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#11131f',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f7f9ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#141726',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#edf2fe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#182449',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e1e9ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1d2e62',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d2deff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#253974',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c1d0ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#304384',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#abbdf9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3a4f97',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8da4ef',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#435db1',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3e63dd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3e63dd',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3358d4',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5472e4',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3a5bc7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#9eb1ff',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#1f2d5c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#d6e1ff',
            alpha: 1,
          },
        },
      },
    },
    blue: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbfdff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0d1520',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f4faff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111927',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e6f4fe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0d2847',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d5efff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#003362',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c2e5ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#004074',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#acd8fc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#104d87',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8ec8f6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#205d9e',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5eb1ef',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2870bd',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0090ff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0090ff',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0588f0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3b9eff',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0d74ce',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#70b8ff',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#113264',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#c2e6ff',
            alpha: 1,
          },
        },
      },
    },
    cyan: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fafdfe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0b161a',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f2fafb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#101b20',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#def7f9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#082c36',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#caf1f6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#003848',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b5e9f0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#004558',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#9ddde7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#045468',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7dcedc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#12677e',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3db9cf',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#11809c',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#00a2c7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#00a2c7',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0797b9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#23afd0',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#107d98',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4ccce6',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0d3c48',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b6ecf7',
            alpha: 1,
          },
        },
      },
    },
    teal: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fafefd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0d1514',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f3fbf9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111c1b',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e0f8f3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0d2d2a',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ccf3ea',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#023b37',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b8eae0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#084843',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#a1ded2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#145750',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#83cdc1',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1c6961',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#53b9ab',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#207e73',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#12a594',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#12a594',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0d9b8a',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0eb39e',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#008573',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0bd8b6',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#0d3d38',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#adf0dd',
            alpha: 1,
          },
        },
      },
    },
    jade: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbfefd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0d1512',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f4fbf7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#121c18',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e6f7ed',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0f2e22',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d6f1e3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0b3b2c',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c3e9d7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#114837',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#acdec8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1b5745',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8bceb6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#246854',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#56ba9f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2a7e68',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#29a383',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#29a383',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#26997b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#27b08b',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#208368',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1fd8a4',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#1d3b31',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#adf0d4',
            alpha: 1,
          },
        },
      },
    },
    green: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbfefc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0e1512',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f4fbf6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#121b17',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e6f6eb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#132d21',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d6f1df',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#113b29',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c4e8d1',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#174933',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#adddc0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#20573e',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8eceaa',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#28684a',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5bb98b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2f7c57',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#30a46c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#30a46c',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#2b9a66',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#33b074',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#218358',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3dd68c',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#193b2d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b1f1cb',
            alpha: 1,
          },
        },
      },
    },
    grass: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbfefb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0e1511',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f5fbf5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#141a15',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e9f6e9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1b2a1e',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#daf1db',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1d3a24',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c9e8ca',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#25482d',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b2ddb5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2d5736',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#94ce9a',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#366740',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#65ba74',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3e7949',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#46a758',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#46a758',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3e9b4f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#53b365',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#2a7e3b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#71d083',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#203c25',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#c2f0c2',
            alpha: 1,
          },
        },
      },
    },
    brown: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefdfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#12110f',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fcf9f6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1c1816',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f6eee7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#28211d',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f0e4d9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#322922',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ebdaca',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3e3128',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e4cdb7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4d3c2f',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dcbc9f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#614a39',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cea37e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7c5f46',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ad7f58',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ad7f58',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#a07553',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#b88c67',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#815e46',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#dbb594',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3e332e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#f2e1ca',
            alpha: 1,
          },
        },
      },
    },
    bronze: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfcfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#141110',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdf7f5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1c1917',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f6edea',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#262220',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#efe4df',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#302a27',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e7d9d3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3b3330',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#dfcdc5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#493e3a',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d3bcb3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5a4c47',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c2a499',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#6f5f58',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#a18072',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#a18072',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#957468',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ae8c7e',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7d5e54',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#d4b3a5',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#43302b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ede0d9',
            alpha: 1,
          },
        },
      },
    },
    gold: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfdfc',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#121211',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#faf9f2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1b1a17',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f2f0e7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#24231f',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eae6db',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2d2b26',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e1dccf',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#38352e',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d8d0bf',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#444039',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cbc0aa',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#544f46',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b9a88d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#696256',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#978365',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#978365',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8c7a5e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#a39073',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#71624b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#cbb99f',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#3b352b',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e8e2d9',
            alpha: 1,
          },
        },
      },
    },
    sky: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f9feff',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0d141f',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f1fafd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#111a27',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e1f6fd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#112840',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d1f0fa',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#113555',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#bee7f5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#154467',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#a9daed',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1b537b',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8dcae3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1f6692',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#60b3d7',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#197cae',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7ce2fe',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7ce2fe',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#74daf8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#a8eeff',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#00749e',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#75c7f0',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#1d3e56',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#c2f3ff',
            alpha: 1,
          },
        },
      },
    },
    mint: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f9fefd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0e1515',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f2fbf9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#0f1b1b',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ddf9f2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#092c2b',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c8f4e9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#003a38',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b3ecde',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#004744',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#9ce0d0',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#105650',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7ecfbd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1e685f',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#4cbba5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#277f70',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#86ead4',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#86ead4',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#7de0cb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#a8f5e5',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#027864',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#58d5ba',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#16433c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#c4f5e1',
            alpha: 1,
          },
        },
      },
    },
    lime: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fcfdfa',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#11130c',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f8faf3',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#151a10',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#eef6d6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1f2917',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e2f0bd',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#29371d',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d3e7a6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#334423',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#c2da91',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3d522a',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#abc978',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#496231',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#8db654',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#577538',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#bdee63',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#bdee63',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#b0e64c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#d4ff70',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#5c7c2f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#bde56c',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#37401c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#e3f7ba',
            alpha: 1,
          },
        },
      },
    },
    yellow: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fdfdf9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#14120b',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefce9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1b180f',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fffab8',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#2d2305',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fff394',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#362b00',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffe770',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#433500',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f3d768',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#524202',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e4c767',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#665417',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#d5ae39',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#836a21',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffe629',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffe629',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffdc00',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffff57',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#9e6c00',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#f5e147',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#473b1f',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#f6eeb4',
            alpha: 1,
          },
        },
      },
    },
    amber: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefdfb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#16120c',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefbe9',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1d180f',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fff7c2',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#302008',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffee9c',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#3f2700',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fbe577',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#4d3000',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f3d673',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#5c3d05',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e9c162',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#714f19',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#e2a336',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#8f6424',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffc53d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffc53d',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffba18',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffd60a',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ab6400',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffca16',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#4f3422',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffe7b3',
            alpha: 1,
          },
        },
      },
    },
    orange: {
      '1': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fefcfb',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#17120e',
            alpha: 1,
          },
        },
      },
      '2': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#fff7ed',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#1e160f',
            alpha: 1,
          },
        },
      },
      '3': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffefd6',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#331e0b',
            alpha: 1,
          },
        },
      },
      '4': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffdfb5',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#462100',
            alpha: 1,
          },
        },
      },
      '5': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffd19a',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#562800',
            alpha: 1,
          },
        },
      },
      '6': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ffc182',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#66350c',
            alpha: 1,
          },
        },
      },
      '7': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f5ae73',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#7e451d',
            alpha: 1,
          },
        },
      },
      '8': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ec9455',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#a35829',
            alpha: 1,
          },
        },
      },
      '9': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#f76b15',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#f76b15',
            alpha: 1,
          },
        },
      },
      '10': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#ef5f00',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ff801f',
            alpha: 1,
          },
        },
      },
      '11': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#cc4e00',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffa057',
            alpha: 1,
          },
        },
      },
      '12': {
        $type: 'color',
        $value: {
          light: {
            model: 'hex',
            hex: '#582d1d',
            alpha: 1,
          },
          dark: {
            model: 'hex',
            hex: '#ffe0c2',
            alpha: 1,
          },
        },
      },
    },
  },
  // themed: {
  //   $collection: {
  //     $modes: ['light', 'dark'],
  //   },
  //   neutral: {
  //     1: { $type: 'color', $value: { $alias: 'radixColors.mauve.1' } },
  //     2: { $type: 'color', $value: { $alias: 'radixColors.mauve.2' } },
  //     3: { $type: 'color', $value: { $alias: 'radixColors.mauve.3' } },
  //     4: { $type: 'color', $value: { $alias: 'radixColors.mauve.4' } },
  //     5: { $type: 'color', $value: { $alias: 'radixColors.mauve.5' } },
  //     6: { $type: 'color', $value: { $alias: 'radixColors.mauve.6' } },
  //     7: { $type: 'color', $value: { $alias: 'radixColors.mauve.7' } },
  //     8: { $type: 'color', $value: { $alias: 'radixColors.mauve.8' } },
  //     9: { $type: 'color', $value: { $alias: 'radixColors.mauve.9' } },
  //     10: { $type: 'color', $value: { $alias: 'radixColors.mauve.10' } },
  //     11: { $type: 'color', $value: { $alias: 'radixColors.mauve.11' } },
  //     12: { $type: 'color', $value: { $alias: 'radixColors.mauve.12' } },
  //   },
  //   accent: {
  //     1: { $type: 'color', $value: { $alias: 'radixColors.violet.1' } },
  //     2: { $type: 'color', $value: { $alias: 'radixColors.violet.2' } },
  //     3: { $type: 'color', $value: { $alias: 'radixColors.violet.3' } },
  //     4: { $type: 'color', $value: { $alias: 'radixColors.violet.4' } },
  //     5: { $type: 'color', $value: { $alias: 'radixColors.violet.5' } },
  //     6: { $type: 'color', $value: { $alias: 'radixColors.violet.6' } },
  //     7: { $type: 'color', $value: { $alias: 'radixColors.violet.7' } },
  //     8: { $type: 'color', $value: { $alias: 'radixColors.violet.8' } },
  //     9: { $type: 'color', $value: { $alias: 'radixColors.violet.9' } },
  //     10: { $type: 'color', $value: { $alias: 'radixColors.violet.10' } },
  //     11: { $type: 'color', $value: { $alias: 'radixColors.violet.11' } },
  //     12: { $type: 'color', $value: { $alias: 'radixColors.violet.12' } },
  //   },
  // },
};
