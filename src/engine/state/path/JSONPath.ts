import { SDTF_PATH_SEPARATOR } from '../../../definitions/index.js';
import { arrayTrimStart } from '../../utils/arrayTrimStart.js';

export interface JSONPathCommonMethods<Self extends JSONPath<any>, PathItemType> {
  update(nextPath: Array<PathItemType>): Self;
  clone(): Self;
  prepend(item: PathItemType): Self;
  append(item: PathItemType): Self;
  replaceAt(i: number, replacer: PathItemType): Self;
  merge(otherPath: Self): Self;
  removeLeft(until: number): Self;
  removeRight(until: number): Self;
  slice(from: number, to: number): Self;
}

export class JSONPath<T> {
  #array: Array<T>;
  #string: string;

  constructor(path: Array<T>, string: string) {
    this.#array = path;
    this.#string = string;
  }

  clear() {
    this.#array = [];
    this.#string = '';
  }

  /**
   * We consider that the value is checked before reaching this class
   * So this function only do a basic join
   */
  #join() {
    return this.#array.join(SDTF_PATH_SEPARATOR);
  }

  get length() {
    return this.#array.length;
  }

  isRootOf(path: JSONPath<T>) {
    return this.#array.every((pathItem, index) => {
      return path.at(index) === pathItem;
    });
  }

  isEqual(path: JSONPath<T>) {
    return this.#string === path.#string;
  }

  isNotEqual(path: JSONPath<T>) {
    return this.#string !== path.#string;
  }

  update(path: Array<T>, string: string) {
    this.#array = path;
    this.#string = string;

    return this;
  }

  pop() {
    const toReturn = this.#array.pop();
    this.#string = this.#join();

    return toReturn;
  }

  prepend(item: T) {
    this.#array.unshift(item);
    this.#string = this.#join();

    return this;
  }

  append(item: T) {
    this.#array.push(item);
    this.#string = this.#join();

    return this;
  }

  at(index: number): T | undefined {
    return this.#array[index];
  }

  head() {
    return this.toArray()[0];
  }

  tail() {
    return this.toArray()[this.length - 1];
  }

  removeAt(i: number) {
    this.#array.splice(i, 1);
    this.#string = this.#join();

    return this;
  }

  replaceAt(i: number, value: T) {
    if (i >= this.#array.length) {
      return this;
    }
    this.#array[i] = value;
    this.#string = this.#join();

    return this;
  }

  removeLeft(until: number) {
    this.#array = this.#array.slice(until);
    this.#string = this.#join();

    return this;
  }

  removeRight(until: number) {
    this.#array = this.#array.slice(0, -1 * until);
    this.#string = this.#join();

    return this;
  }

  trimStartWith(path: JSONPath<T>) {
    this.#array = arrayTrimStart(this.#array, path.toArray());
    this.#string = this.#join();

    return this;
  }

  concat(elements: Array<T>) {
    this.#array = this.#array.concat(elements);
    this.#string = this.#join();

    return this;
  }

  toString() {
    return this.#string;
  }

  // Needed for Vitest diff (called in JSON.stringify)
  toJSON() {
    return this.toArray();
  }

  toArray() {
    return this.#array;
  }
}
