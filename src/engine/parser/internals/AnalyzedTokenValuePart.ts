import { JSONValue } from '../../../utils/JSONDefinitions.js';
import { ValuePath } from '../../state/path/ValuePath.js';
import { TreePath } from '../../state/path/TreePath.js';

export type AnalyzedTokenValueAliasPart =
  | {
      type: 'topLevelAlias';
      isResolvable?: boolean;
      alias: { path: TreePath };
    }
  | {
      type: 'modeLevelAlias';
      isResolvable?: boolean;
      localMode: string;
      alias: { path: TreePath; targetMode: string };
    }
  | {
      type: 'valueLevelAlias';
      isResolvable?: boolean;
      localMode: string;
      valuePath: ValuePath;
      alias: { path: TreePath; targetMode: string };
    };
export type AnalyzedTokenValuePrimitivePart = {
  type: 'primitive';
  localMode: string;
  valuePath: ValuePath;
  value: JSONValue;
};
export type AnalyzedTokenValuePart = AnalyzedTokenValueAliasPart | AnalyzedTokenValuePrimitivePart;
