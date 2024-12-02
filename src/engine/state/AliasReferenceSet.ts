import { ValuePath } from './path/ValuePath.js';
import { TokenState } from './TokenState.js';
import { UnresolvableTokenState } from './UnresolvableTokenState.js';
import { SDTFError } from '../../errors/index.js';
import { TreePath } from './path/TreePath.js';

type AliasReferenceBase = {
  from: {
    treePath: TreePath;
    valuePath: ValuePath;
    // null maps with $mode === undefined but still make the distinction to allow this store to query topLevelAliases
    mode: string | null;
  };
  to: {
    treePath: TreePath;
    // null maps with $mode === undefined but still make the distinction to allow this store to query topLevelAliases
    mode: string | null;
  };
};

export type ResolvableAliasReference = AliasReferenceBase & { isResolvable: true };
export type UnresolvableAliasReference = AliasReferenceBase & {
  isResolvable: false;
  reason: string;
};
export type AliasReference = ResolvableAliasReference | UnresolvableAliasReference;

export type ResolvedStatefulAliasReference = AliasReferenceBase & {
  status: 'resolved';
  tokenState: TokenState;
};
export type UnresolvableStatefulAliasReference = AliasReferenceBase & {
  status: 'unresolvable';
  unresolvableTokenState: UnresolvableTokenState;
};
export type StatefulAliasReference =
  | ResolvedStatefulAliasReference
  | UnresolvableStatefulAliasReference;

export class AliasReferenceSet {
  #aliasReferences: Array<AliasReference> = [];

  *[Symbol.iterator]() {
    const data = this.#aliasReferences;
    for (let i = 0; i < data.length; i++) {
      yield data[i];
    }
  }

  /**
   * @internal
   * @param treePath
   */
  getDeepFromTreePath(treePath: TreePath): Array<AliasReference> {
    const maybeReferences = this.getManyFrom({ treePath });
    if (maybeReferences.length > 0) {
      return maybeReferences
        .map(ref => {
          const maybeChildrenReferences = this.getDeepFromTreePath(ref.to.treePath);
          if (maybeChildrenReferences.length > 0) {
            return maybeChildrenReferences;
          }
          return ref;
        })
        .flat();
    }
    return [];
  }

  /**
   * Take a starting alias and will dig until the end
   * To retrieve the target value
   */
  getOneDeepFrom(from: {
    treePath: AliasReference['from']['treePath'];
    valuePath: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }): AliasReference | undefined {
    const maybeReference = this.getOne(from);

    if (!maybeReference) return undefined;

    let to: AliasReference['to'] = maybeReference.to;
    let isResolvable = maybeReference.isResolvable;
    let reason: string | undefined;

    while (true) {
      const nextTo = this.getOne({
        mode: to.mode,
        valuePath: ValuePath.empty(),
        treePath: to.treePath,
      });

      if (!nextTo) {
        break;
      } else {
        to = nextTo.to;
        isResolvable &&= nextTo.isResolvable;
        if (!reason && !nextTo.isResolvable) {
          reason = nextTo.reason;
        }
      }
    }

    return {
      from,
      to,
      isResolvable,
      reason,
    } as AliasReference;
  }

  /**
   * @internal
   * @param treePath
   */
  getDeepToTreePath(treePath: TreePath): Array<AliasReference> {
    const maybeReferences = this.getManyTo({ treePath });
    if (maybeReferences.length > 0) {
      return maybeReferences
        .map(ref => {
          const maybeChildrenReferences = this.getDeepToTreePath(ref.from.treePath);
          if (maybeChildrenReferences.length > 0) {
            return maybeChildrenReferences;
          }
          return ref;
        })
        .flat();
    }
    return [];
  }

  private checkCircularDependencies(reference: AliasReference) {
    const serializedFromTreePath = reference.from.treePath.toString();
    const serializedToTreePath = reference.to.treePath.toString();

    // Self circular reference
    if (serializedFromTreePath === serializedToTreePath) {
      throw new SDTFError(
        'SDTF_CIRCULAR_ALIAS_REFERENCE_FOUND',
        `Token "${serializedFromTreePath}" references itself`,
      );
    } else {
      const fromTo = this.getDeepFromTreePath(reference.to.treePath);
      fromTo.forEach(ref => {
        if (serializedFromTreePath === ref.to.treePath.toString()) {
          throw new SDTFError(
            'SDTF_CIRCULAR_ALIAS_REFERENCE_FOUND',
            `Token "${serializedFromTreePath}" circularly references "${serializedToTreePath}"`,
          );
        }
      });

      // TODO: Ensure we have the full picture of the algorithm
      // const toFrom = this.getDeepToTreePath(reference.from.treePath);
    }
  }

  add(reference: AliasReference) {
    this.checkCircularDependencies(reference);

    const { from } = reference;

    if (this.hasFrom(from)) {
      throw new SDTFError(
        'SDTF_ALIAS_SET_REFERENCE_ALREADY_EXISTS',
        `Alias reference already exists for ${JSON.stringify(from)}`,
      );
    }

    this.#aliasReferences.push(reference);
  }

  updateAtFrom(at: AliasReference['from'], candidate: AliasReference) {
    this.checkCircularDependencies(candidate);

    const atTreePathSerializedPath = at.treePath.toString();
    const atValuePathSerializedPath = at.valuePath.toString();

    const index = this.#aliasReferences.findIndex(reference => {
      return (
        reference.from.treePath.toString() === atTreePathSerializedPath &&
        reference.from.valuePath.toString() === atValuePathSerializedPath &&
        reference.from.mode === at.mode
      );
    });

    if (index === -1) {
      throw new SDTFError(
        'SDTF_ALIAS_SET_REFERENCE_DOES_NOT_EXIST',
        `Alias reference does not exist for ${JSON.stringify(at)}`,
      );
    }

    this.#aliasReferences[index] = candidate;
  }

  upsertAtFrom(reference: AliasReference) {
    const { from } = reference;

    if (this.hasFrom(from)) {
      this.updateAtFrom(from, reference);
    } else {
      this.add(reference);
    }
  }

  deleteOne({ treePath, valuePath, mode }: AliasReference['from']) {
    const stringTreePath = treePath.toString();
    const stringValuePath = valuePath.toString();

    this.#aliasReferences = this.#aliasReferences.filter(aliasRef => {
      return !(
        aliasRef.from.treePath.toString() === stringTreePath &&
        aliasRef.from.mode === mode &&
        aliasRef.from.valuePath.toString() === stringValuePath
      );
    });
  }

  deleteManyFrom(from: {
    treePath: AliasReference['from']['treePath'];
    mode?: AliasReference['from']['mode'];
    valuePath?: AliasReference['from']['valuePath'];
  }) {
    const serializedPath = from.treePath.toString();
    const serializedValuePath = from.valuePath?.toString() ?? ValuePath.empty().toString();

    this.#aliasReferences = this.#aliasReferences.filter(reference => {
      const shouldIncludeOnValuePath =
        from.valuePath !== undefined
          ? serializedValuePath === reference.from.valuePath.toString()
          : true;
      const shouldIncludeOnMode =
        from.mode !== undefined ? reference.from.mode === from.mode : true;

      return !(
        reference.from.treePath.toString() === serializedPath &&
        shouldIncludeOnValuePath &&
        shouldIncludeOnMode
      );
    }, []);
  }

  unlinkManyTo(
    to: {
      treePath: AliasReference['to']['treePath'];
      mode?: AliasReference['to']['mode'];
    },
    reason?: string,
  ) {
    const serializedPath = to.treePath.toString();

    const referencesToUnlink = this.#aliasReferences.reduce<Array<AliasReference>>(
      (acc, reference, index) => {
        const shouldIncludeOnMode = to.mode !== undefined ? reference.to.mode === to.mode : true;

        if (reference.to.treePath.toString() === serializedPath && shouldIncludeOnMode) {
          acc.push(reference);
        }

        return acc;
      },
      [],
    );

    referencesToUnlink.forEach(reference => {
      if (reference.isResolvable) {
        // @ts-expect-error - We are mutating the object
        reference.isResolvable = false;
        Reflect.set(
          reference,
          'reason',
          reason ?? `Token at path "${reference.to.treePath.toString()}" has been unlinked`,
        );
      }
    });
  }

  linkManyTo(to: {
    treePath: AliasReference['to']['treePath'];
    mode?: AliasReference['to']['mode'];
  }) {
    const serializedPath = to.treePath.toString();

    const referencesToLink = this.#aliasReferences.reduce<Array<AliasReference>>(
      (acc, reference, index) => {
        const shouldIncludeOnMode = to.mode !== undefined ? reference.to.mode === to.mode : true;

        if (reference.to.treePath.toString() === serializedPath && shouldIncludeOnMode) {
          acc.push(reference);
        }

        return acc;
      },
      [],
    );

    referencesToLink.forEach(reference => {
      if (!reference.isResolvable) {
        // @ts-expect-error - We are mutating the object
        reference.isResolvable = true;
        Reflect.deleteProperty(reference, 'reason');
      }
    });
  }

  hasFrom(from: AliasReference['from']) {
    const fromTreePathSerializedPath = from.treePath.toString();
    const fromValuePathSerializedPath = from.valuePath.toString();

    return this.#aliasReferences.some(reference => {
      return (
        reference.from.treePath.toString() === fromTreePathSerializedPath &&
        reference.from.valuePath.toString() === fromValuePathSerializedPath &&
        reference.from.mode === from.mode
      );
    });
  }

  getOne(from: AliasReference['from']) {
    const fromTreePathSerializedPath = from.treePath.toString();
    const fromValuePathSerializedPath = from.valuePath.toString();

    return this.#aliasReferences.find(reference => {
      return (
        fromTreePathSerializedPath === reference.from.treePath.toString() &&
        reference.from.valuePath.toString() === fromValuePathSerializedPath &&
        reference.from.mode === from.mode
      );
    });
  }

  getManyTo<
    O extends { isResolvable?: boolean },
    R extends O extends { isResolvable: true }
      ? Array<ResolvableAliasReference>
      : O extends { isResolvable: false }
        ? Array<UnresolvableAliasReference>
        : Array<AliasReference>,
  >(
    to: {
      treePath: AliasReference['to']['treePath'];
      mode?: AliasReference['to']['mode'];
    },
    options?: O,
  ): R {
    const toSerializedPath = to.treePath.toString();

    return this.#aliasReferences.filter(reference => {
      const shouldIncludeOnMode = to.mode !== undefined ? reference.to.mode === to.mode : true;

      const shouldIncludeOnResolvableState =
        options?.isResolvable === undefined
          ? true
          : options?.isResolvable
            ? reference.isResolvable
            : !reference.isResolvable;

      return (
        toSerializedPath === reference.to.treePath.toString() &&
        shouldIncludeOnMode &&
        shouldIncludeOnResolvableState
      );
    }) as R;
  }

  getManyFrom<
    O extends { isResolvable?: boolean },
    R extends O extends { isResolvable: true }
      ? Array<ResolvableAliasReference>
      : O extends { isResolvable: false }
        ? Array<UnresolvableAliasReference>
        : Array<AliasReference>,
  >(
    from: {
      treePath: AliasReference['from']['treePath'];
      valuePath?: AliasReference['from']['valuePath'];
      mode?: AliasReference['from']['mode'];
    },
    options?: O,
  ): R {
    const fromSerializedPath = from.treePath.toString();
    const fromValuePathSerializedPath = from.valuePath?.toString() ?? ValuePath.empty().toString();

    return this.#aliasReferences.filter(reference => {
      const shouldIncludeOnValuePath =
        from.valuePath !== undefined
          ? fromValuePathSerializedPath === reference.from.valuePath.toString()
          : true;
      const shouldIncludeOnMode =
        from.mode !== undefined ? reference.from.mode === from.mode : true;

      const shouldIncludeOnResolvableState =
        options?.isResolvable === undefined
          ? true
          : options?.isResolvable
            ? reference.isResolvable
            : !reference.isResolvable;

      return (
        reference.from.treePath.toString() === fromSerializedPath &&
        shouldIncludeOnValuePath &&
        shouldIncludeOnMode &&
        shouldIncludeOnResolvableState
      );
    }) as R;
  }

  /**
   * Retrieve the AliasReference of the exact value, or the one of a parent,
   * e.g, the mode level alias, or a property inside a composite token
   */
  public getOneOrParentFrom({
    treePath,
    valuePath,
    mode,
  }: {
    treePath: AliasReference['from']['treePath'];
    valuePath: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }) {
    let currentPath = valuePath.clone();

    while (currentPath.length >= 0) {
      const aliases = this.getManyFrom({
        mode,
        treePath,
        valuePath: currentPath,
      });

      if (aliases.length === 0) {
        // It means we checked the mode level alias and didn't find anything
        if (currentPath.length === 0) break;

        currentPath.pop();

        continue;
      }

      return aliases[0];
    }

    return undefined;
  }

  /**
   * Retrieve the target coordinates from a starting point.
   * E.g, if you want the value of a dimension, it'll tell you where is the JSON value.
   * It'll be either on a number token, or the value of a dimension token.
   */
  public getOneDeepAndPathInfosFrom({
    treePath: initialTreePath,
    valuePath,
    mode: targetMode,
  }: {
    treePath: AliasReference['from']['treePath'];
    valuePath: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }) {
    let currentPath = valuePath.clone();
    let targetPath = ValuePath.empty();

    let aliasRef: AliasReference | undefined = undefined;

    let aliasMode = targetMode;
    let treePath = initialTreePath;

    let traversedPath = ValuePath.empty();

    while (currentPath.length >= 0) {
      const aliases = this.getManyFrom({
        mode: aliasMode,
        treePath,
        valuePath: currentPath,
      });

      if (aliases.length === 0) {
        // It means we checked the mode level alias and didn't find anything
        if (currentPath.length === 0) break;

        targetPath.prepend(currentPath.pop()!);

        continue;
      }

      aliasRef = aliases[0];
      traversedPath = traversedPath.merge(currentPath);
      currentPath = targetPath.clone();
      targetPath = ValuePath.empty();
      treePath = aliases[0].to.treePath;
      aliasMode = aliases[0].to.mode!;
    }

    return aliasRef
      ? {
          aliasRef: {
            ...aliasRef,
            from: {
              mode: targetMode,
              valuePath,
              treePath: initialTreePath,
            },
          },
          toValuePath: targetPath,
          traversedPath,
        }
      : undefined;
  }

  public clear() {
    this.#aliasReferences.length = 0;
  }
}
