import { SDTF_PATH_SEPARATOR } from '../../../definitions/internals/designTokenTreeConstants.js';
import { SDTFError } from '../../../errors/SDTFError.js';
import { JSONValuePath } from '../../../utils/JSONDefinitions.js';
import { JSONPath, JSONPathCommonMethods } from './JSONPath.js';

export class TreePath extends JSONPath<string> implements JSONPathCommonMethods<TreePath, string> {
  // Required for Zod
  static readonly name = 'TreePath';

  static #validateItem(item: string) {
    if (typeof item !== 'string') {
      throw new SDTFError(
        'SDTF_INVALID_TREE_PATH',
        `Tree path members must be a string, found: ${JSON.stringify(item)}`,
      );
    }
  }

  static #validateAndJoinPath(path: Array<string>) {
    let joined = '';

    for (let i = 0; i < path.length; i++) {
      const item = path[i];

      TreePath.#validateItem(item);

      if (item === '') continue;

      joined += i === path.length - 1 ? item : `${item}${SDTF_PATH_SEPARATOR}`;
    }

    return joined;
  }

  static empty() {
    return new TreePath([], '');
  }

  /**
   * Build a `TreePath` from a JSON value path
   * @param path
   */
  static fromJsonValuePath(path: JSONValuePath) {
    // Validation is done in the constructor
    return new TreePath(path as Array<string>);
  }

  /**
   * Build a `TreePath` from a string representation
   * @param stringPath
   */
  static fromString(stringPath: string) {
    return new TreePath(stringPath.length === 0 ? [] : stringPath.split(SDTF_PATH_SEPARATOR));
  }

  /**
   * By passing a string to the constructor, **nothing will be validated. So only do it if you know what you're doing**
   */
  constructor(path: Array<string>, string?: string) {
    if (!Array.isArray(path)) {
      throw new SDTFError(
        'SDTF_INVALID_TREE_PATH',
        `Tree path is expected to be an array, found: ${JSON.stringify(path)}`,
      );
    }
    super(path, string ?? TreePath.#validateAndJoinPath(path));
  }

  /**
   * Returns true if the path is empty = root level of token tree
   */
  get isRoot() {
    return this.length === 0;
  }

  /**
   * Mutates the current path
   * @param path
   */
  update(path: Array<string>) {
    if (!Array.isArray(path)) {
      throw new SDTFError(
        'SDTF_INVALID_TREE_PATH',
        `Tree path is expected to be an array, found: ${JSON.stringify(path)}`,
      );
    }
    super.update(path, TreePath.#validateAndJoinPath(path));

    return this;
  }

  /**
   * Mutates the current path
   * @param item
   */
  prepend(item: string) {
    TreePath.#validateItem(item);

    super.prepend(item);

    return this;
  }

  /**
   * Mutates the current path
   */
  append(item: string) {
    TreePath.#validateItem(item);

    super.append(item);

    return this;
  }

  /**
   * Mutates the current path
   */
  removeLeft(until: number) {
    super.removeLeft(until);

    return this;
  }

  /**
   * Mutates the current path
   */
  removeRight(until: number) {
    super.removeRight(until);

    return this;
  }

  /**
   * Mutates the current path
   */
  replaceAt(i: number, replacer: string) {
    TreePath.#validateItem(replacer);

    super.replaceAt(i, replacer);

    return this;
  }

  /**
   * Creates a copy
   */
  clone() {
    return new TreePath(this.toArray().slice(0), this.toString());
  }

  /**
   * Creates a copy
   */
  merge(otherTreePath: TreePath) {
    // Taking advantage that both `TreePath` are already validated
    if (this.length === 0) {
      return new TreePath(otherTreePath.clone().toArray(), otherTreePath.toString());
    }
    return new TreePath(
      this.toArray().concat(otherTreePath.toArray()),
      `${this.toString()}${SDTF_PATH_SEPARATOR}${otherTreePath.toString()}`,
    );
  }

  /**
   * Creates a copy
   */
  slice(from: number, to?: number) {
    return new TreePath(this.toArray().slice(from, to));
  }

  /**
   * Creates a copy
   */
  makeParentPath() {
    // + 1 -> separator
    const stringToRemoveLength = this.tail().length + 1;

    return new TreePath(
      this.toArray().slice(0, this.length - 1),
      this.toString().substring(0, this.toString().length - stringToRemoveLength),
    );
  }

  /**
   * Override console.log serialization
   */
  [Symbol.for('nodejs.util.inspect.custom')](_depth: unknown, _opts: unknown) {
    return `TreePath{${this.toString()}}`;
  }
}
