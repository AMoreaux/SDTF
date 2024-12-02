import { JSONValue } from '../../utils/JSONDefinitions.js';
import { deepSetJSONValue } from '../../utils/deepSetJSONValue.js';
import { deepClone } from '../utils/deepClone.js';
import { AnalyzedTokenValuePrimitivePart } from '../parser/internals/AnalyzedTokenValuePart.js';
import { ValuePath } from './path/ValuePath.js';

type ValuePart = {
  mode: string;
  valuePath: ValuePath;
  value: JSONValue;
};

type ValuePartSelector = {
  mode: ValuePart['mode'];
  valuePath: ValuePart['valuePath'];
};

export class TokenRawValueParts<Value = unknown> {
  #rawParts: Array<ValuePart> = [];

  #unsafeAdd(part: ValuePart) {
    this.#rawParts.push(part);
  }

  *[Symbol.iterator]() {
    const data = this.#rawParts;
    for (let i = 0; i < data.length; i++) {
      yield data[i];
    }
  }

  public get size() {
    return this.#rawParts.length;
  }

  public get modes() {
    return Array.from(new Set(this.#rawParts.map(part => part.mode)));
  }

  public clear() {
    this.#rawParts.length = 0;
  }

  /*
   * By returning `true` you want to delete the value, and `false` keep it.
   */
  public filterDelete(fn: (part: ValuePart) => boolean) {
    this.#rawParts = this.#rawParts.filter(v => !fn(v));
  }

  public has({ mode, valuePath }: ValuePartSelector) {
    return this.#rawParts.some(part => {
      return part.mode === mode && part.valuePath.toString() === valuePath.toString();
    });
  }

  public hasChildren({ mode, valuePath }: ValuePartSelector) {
    return this.#rawParts.some(
      part =>
        part.mode === mode &&
        valuePath.length < part.valuePath.length &&
        part.valuePath.toString().includes(valuePath.toString()),
    );
  }

  public hasParent({ mode, valuePath }: ValuePartSelector) {
    // You don't have a parent if the value path length is 1
    if (valuePath.length <= 1) {
      return false;
    }

    const path = valuePath.clone();

    while (path.length > 0) {
      if (
        this.#rawParts.some(
          part => part.mode === mode && part.valuePath.toString().includes(path.toString()),
        )
      )
        return true;

      path.pop();
    }

    return false;
  }

  /**
   * This function will retrieve the nearest parent
   */
  public getParent({ mode, valuePath }: ValuePartSelector) {
    // If the value path length is 1 you can't have a parent
    if (valuePath.length <= 1) {
      return undefined;
    }

    const path = valuePath.clone();
    path.pop();

    while (path.length > 0) {
      const valuePart = this.#rawParts.find(
        part => part.mode === mode && part.valuePath.toString() === path.toString(),
      );

      if (valuePart) return valuePart;

      path.pop();
    }

    return undefined;
  }

  public getRawPart({ mode, valuePath }: ValuePartSelector) {
    return this.#rawParts.find(
      part => part.mode === mode && part.valuePath.toString() === valuePath.toString(),
    );
  }

  public getRawPartsFromPrefix({
    mode,
    prefixPath,
  }: {
    mode: string;
    prefixPath: ValuePath;
  }): [ValuePart, ...ValuePart[]] | undefined {
    const output = this.#rawParts.filter(
      part => part.mode === mode && prefixPath.isRootOf(part.valuePath),
    );

    return output.length === 0 ? undefined : (output as [ValuePart, ...ValuePart[]]);
  }

  public getChildren({ mode, valuePath }: ValuePartSelector) {
    return this.#rawParts.filter(
      part =>
        part.mode === mode &&
        valuePath.length < part.valuePath.length &&
        part.valuePath.toArray().includes(valuePath.toString()),
    );
  }

  public getAll({ mode }: { mode?: string } = {}) {
    if (mode) {
      return this.#rawParts.filter(part => part.mode === mode);
    }
    return [...this.#rawParts];
  }

  public add(part: ValuePart) {
    if (this.has(part)) {
      return false;
    }
    this.#unsafeAdd(part);
    return true;
  }

  public update(where: ValuePartSelector, candidate: ValuePart) {
    const index = this.#rawParts.findIndex(
      part => part.mode === where.mode && part.valuePath.toString() === where.valuePath.toString(),
    );
    if (index === -1) {
      return false;
    }
    this.#rawParts[index] = candidate;
    return true;
  }

  public upsert(where: ValuePartSelector, candidate: ValuePart) {
    if (!this.update(where, candidate)) {
      this.add(candidate);
    }
  }

  public delete(where: ValuePartSelector) {
    const index = this.#rawParts.findIndex(
      part => part.mode === where.mode && part.valuePath.toString() === where.valuePath.toString(),
    );
    if (index === -1) {
      return false;
    }
    this.#rawParts.splice(index, 1);
    return true;
  }

  public hasMode(mode: string) {
    return this.#rawParts.some(part => part.mode === mode);
  }

  public renameMode(previousMode: string, nextMode: string) {
    let hasFound = false;
    this.#rawParts.forEach(part => {
      if (part.mode === previousMode) {
        part.mode = nextMode;
        hasFound = true;
      }
    });
    return hasFound;
  }

  public deleteMode(mode: string) {
    const partsToDelete = this.#rawParts.filter(part => part.mode === mode);
    if (partsToDelete.length === 0) {
      return false;
    }
    partsToDelete.forEach(part => {
      const index = this.#rawParts.indexOf(part);
      /* v8 ignore next 3 */
      if (index === -1) {
        throw new Error('Cannot find index of RawValuePart');
      }
      this.#rawParts.splice(index, 1);
    });
    return true;
  }

  public toObject() {
    const acc = {};
    this.#rawParts.forEach(part => {
      deepSetJSONValue(acc, [part.mode, ...part.valuePath.toArray()], part.value);
    });
    return acc as Record<string, Value>;
  }

  public toAnalyzedValuePrimitiveParts(): Array<AnalyzedTokenValuePrimitivePart> {
    return this.#rawParts.map(part => ({
      type: 'primitive',
      localMode: part.mode,
      valuePath: part.valuePath.clone(),
      value: deepClone(part.value),
    }));
  }
}
