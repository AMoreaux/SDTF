import { SpecifyDesignToken, treeNodeNameSchema } from '../../definitions/index.js';
import {
  TreeNodeDescription,
  TreeNodeExtensions,
  validateTreeNodeDescription,
  validateTreeNodeExtensions,
} from '../../definitions/internals/designTokenTree.js';
import { TreeState } from './TreeState.js';
import { SDTFError } from '../../errors/index.js';
import { JSONObject, JSONValue } from '../../utils/JSONDefinitions.js';
import { AnalyzedSDTFNode } from '../parser/internals/AnalyzedSDTFNode.js';
import { TreePath } from './path/TreePath.js';

export interface TreeNodeInterface {
  readonly isToken: boolean;
  readonly isGroup: boolean;
  readonly isCollection: boolean;
  getJSONProperties(): JSONValue | SpecifyDesignToken;
  toJSON(): JSONValue | SpecifyDesignToken;
  move(newPath: TreePath): void;
}

export type TreeNodeStateParams = AnalyzedSDTFNode & {
  $description: string | undefined;
  $extensions: TreeNodeExtensions | undefined;
};

export class TreeNodeState {
  protected treeState: TreeState;
  #name: string;
  #path: TreePath;
  #description: string | undefined;
  #extensions: TreeNodeExtensions | undefined;

  constructor(
    treeState: TreeState,
    params: TreeNodeStateParams,
    // path: Array<string>,
    // description: string | undefined,
    // extensions: { [k: string]: unknown } | undefined,
    // shouldValidateName = true,
  ) {
    this.treeState = treeState;

    this.#name = params.name;
    this.#path = params.path.clone(); // clone the array to the Node instance

    this.#description = params.$description;
    if (params.$extensions) {
      this.#extensions = JSON.parse(JSON.stringify(params.$extensions));
    }
  }

  public get name() {
    return this.#name;
  }

  public get path() {
    return this.#path;
  }

  /**
   * @deprecated Use `path.toString()` instead.
   */
  public get stringPath() {
    return this.#path.toString();
  }

  public get description() {
    return this.#description;
  }

  public get extensions() {
    return this.#extensions;
  }

  public get parentPath() {
    return this.#path.makeParentPath();
  }

  public get parentStringPath() {
    return this.parentPath.toString();
  }

  public rename(newName: string) {
    const validatedNewName = treeNodeNameSchema.parse(newName, {
      path: this.#path.toArray(),
    });

    const newPath = this.#path.makeParentPath().append(validatedNewName);

    if (validatedNewName === this.#name) {
      return false;
    }

    if (!this.treeState.isAvailablePath(newPath)) {
      throw new SDTFError('SDTF_PATH_ALREADY_TAKEN', `Path "${newPath}" is already taken.`);
    }

    this.#name = validatedNewName;
    this.#path = newPath;

    return true;
  }

  public setPath(newPath: TreePath) {
    if (!this.treeState.isAvailablePath(newPath)) {
      throw new SDTFError('SDTF_PATH_ALREADY_TAKEN', `Path "${newPath}" is already taken.`);
    }
    const extractedName = newPath.tail();
    const validatedNewName = treeNodeNameSchema.parse(extractedName, {
      path: this.#path.toArray(),
    });
    const validatedPath = newPath.makeParentPath().append(validatedNewName);

    this.#path = validatedPath;
    this.#name = validatedNewName;
  }

  public updatePathItem(atIndex: number, replacer: string) {
    // We do not allow to update the last item of the path -> rename
    if (atIndex === this.#path.length - 1) {
      throw new SDTFError('SDTF_UPDATE_PATH', `Cannot update the last index of the path.`);
    }

    this.#path.replaceAt(atIndex, replacer);
  }

  public updateDescription(description: TreeNodeDescription) {
    const validatedDescription = validateTreeNodeDescription(description);
    this.#description = validatedDescription;
  }

  public updateExtensions(extensions: TreeNodeExtensions) {
    const validatedExtensions = validateTreeNodeExtensions(extensions);
    this.#extensions = validatedExtensions;
  }

  public getAllChildren() {
    return this.treeState.getChildrenOf(this.path);
  }
  public getParent() {
    return this.treeState.getParentsOf(this.path, 1)[0];
  }

  /**
   * @internal
   */
  public getCommonJSON(): JSONObject {
    return {
      ...((this.#description ? { $description: this.#description } : {}) as JSONObject),
      ...((this.#extensions ? { $extensions: this.#extensions } : {}) as JSONObject),
    };
  }
}
