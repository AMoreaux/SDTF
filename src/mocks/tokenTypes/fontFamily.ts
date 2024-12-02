import { SpecifyFontFamilyValue } from '../../definitions/tokenTypes/fontFamily.js';
import { pickRandomInList } from '../../utils/mockGenerators.js';

const fontFamilies = [
  'Arial',
  'Calibri',
  'Cambria',
  'Candara',
  'Consolas',
  'Corbel',
  'Franklin Gothic',
  'Futura',
  'Georgia',
  'Gill Sans',
  'Helvetica',
  'Lato',
  'Lucida Sans Unicode',
  'Montserrat',
  'Neue Haas Unica',
  'Open Sans',
  'Optima',
  'Palatino Linotype',
  'Roboto',
  'Segoe UI',
  'Tahoma',
  'Trebuchet MS',
  'Verdana',
  'Arial Narrow',
  'Bookman Old Style',
  'Brush Script MT',
  'Comic Sans MS',
  'Copperplate',
  'Courier New',
  'Impact',
  'Graphik',
  'Proxima Nova',
  'Aktiv Grotesk',
  'Neue Haas Grotesk',
  'Futura PT',
  'Univers',
  'Avenir',
];

export function getMockedFontFamilyValue(
  override?: SpecifyFontFamilyValue,
): SpecifyFontFamilyValue {
  return override ?? pickRandomInList(fontFamilies);
}
