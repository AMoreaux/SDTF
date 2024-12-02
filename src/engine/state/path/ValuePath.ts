import { SDTF_PATH_SEPARATOR } from '../../../definitions/index.js';
import { SDTFError } from '../../../errors/index.js';
import { JSONPath, JSONPathCommonMethods } from './JSONPath.js';

export class ValuePath
  extends JSONPath<string | number>
  implements JSONPathCommonMethods<ValuePath, string | number>
{
  // Required for Zod
  static readonly name = 'ValuePath';

  static #validateItem(item: string | number) {
    if (typeof item !== 'string' && typeof item !== 'number') {
      throw new SDTFError(
        'SDTF_INVALID_TREE_PATH',
        `Tree path members must be a string, found: ${JSON.stringify(item)}`,
      );
    }
  }

  static #validateAndJoinPath(path: Array<string | number>) {
    let joined = '';

    for (let i = 0; i < path.length; i++) {
      const item = path[i];

      ValuePath.#validateItem(item);

      if (item === '') continue;

      joined += i === path.length - 1 ? item : `${item}${SDTF_PATH_SEPARATOR}`;
    }

    return joined;
  }

  static empty() {
    return new ValuePath([], '');
  }

  /**
   * By passing a string to the constructor, **nothing will be validated**
   * **So only do it if you know what you're doing**
   */
  constructor(path: Array<string | number>, string?: string) {
    if (!Array.isArray(path)) {
      throw new SDTFError(
        'SDTF_INVALID_TREE_PATH',
        `Value path is expected to be an array, found: ${JSON.stringify(path)}`,
      );
    }
    super(path, string ?? ValuePath.#validateAndJoinPath(path));
  }

  /**
   * Returns true if the path is empty = mode level of token value
   */
  get isModeLevel() {
    return this.length === 0;
  }

  /**
   * Mutates the current path
   * @param path
   */
  update(path: Array<string | number>) {
    super.update(path, ValuePath.#validateAndJoinPath(path));

    return this;
  }

  /**
   * Mutates the current path
   * @param item
   */
  prepend(item: string | number) {
    ValuePath.#validateItem(item);

    super.prepend(item);

    return this;
  }

  /**
   * Mutates the current path
   * @param item
   */
  append(item: string | number) {
    ValuePath.#validateItem(item);

    super.append(item);

    return this;
  }

  /**
   * Mutates the current path
   * @param i
   * @param replacer
   */
  replaceAt(i: number, replacer: string | number) {
    ValuePath.#validateItem(replacer);

    super.replaceAt(i, replacer);

    return this;
  }

  /**
   * Mutates the current path
   * @param until
   */
  removeLeft(until: number) {
    super.removeLeft(until);

    return this;
  }

  /**
   * Mutates the current path
   * @param until
   */
  removeRight(until: number) {
    super.removeRight(until);

    return this;
  }

  /**
   * Creates a copy
   */
  clone() {
    return new ValuePath(this.toArray().slice(0), this.toString());
  }

  /**
   * Creates a copy
   * @param otherTreePath
   */
  merge(otherTreePath: ValuePath) {
    // Taking advantage that both `TreePath` are already validated
    if (this.length === 0) {
      return new ValuePath(otherTreePath.clone().toArray(), otherTreePath.toString());
    }
    return new ValuePath(
      this.toArray().concat(otherTreePath.toArray()),
      `${this.toString()}${SDTF_PATH_SEPARATOR}${otherTreePath.toString()}`,
    );
  }

  /**
   * Creates a copy
   */
  makeParentPath() {
    // + 1 -> separator
    const lastValue = this.tail();

    const stringToRemoveLength =
      (typeof lastValue === 'string' ? lastValue : lastValue.toString()).length + 1;

    return new ValuePath(
      this.toArray().slice(0, this.length - 1),
      this.toString().substring(0, this.toString().length - stringToRemoveLength),
    );
  }

  /**
   * Creates a copy
   * @param from
   * @param to
   */
  slice(from: number, to: number) {
    return new ValuePath(this.toArray().slice(from, to));
  }

  /**
   * Override console.log serialization
   */
  [Symbol.for('nodejs.util.inspect.custom')](_depth: unknown, _opts: unknown) {
    return `ValuePath{${this.toString()}}`;
  }
}
