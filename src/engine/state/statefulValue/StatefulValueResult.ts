import {
  PickSpecifyDesignToken,
  SpecifyDesignTokenTypeName,
  SpecifyModeAndValueLevelAliasSignature,
} from '../../../definitions/index.js';
import { TokenState } from '../TokenState.js';
import {
  ResolvableModeLevelAlias,
  ResolvableTopLevelAlias,
  ResolvableValueLevelAlias,
  UnresolvableModeLevelAlias,
  UnresolvableTopLevelAlias,
  UnresolvableValueLevelAlias,
} from './aliasing.js';
import { SDTFError } from '../../../errors/index.js';

/**
 * An InnerValue is a wrapper around the primitive value of a token that allows for
 * mapping over the different possible cases of the inner mode value, being value
 * level aliases or primitive values.
 */
export class InnerValue<
  T extends unknown = unknown,
  InitialRawType = Exclude<T, UnresolvableValueLevelAlias | ResolvableValueLevelAlias>,
  TypeOverride extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
> {
  #value: T;
  tokenState: TokenState;

  constructor(value: T, tokenState: TokenState) {
    this.#value = value;
    this.tokenState = tokenState;
  }

  private _matchIsUnresolvableValueLevelAlias(v: unknown): v is UnresolvableValueLevelAlias {
    return v instanceof UnresolvableValueLevelAlias;
  }
  private _matchIsResolvableValueLevelAlias(v: unknown): v is ResolvableValueLevelAlias {
    return v instanceof ResolvableValueLevelAlias;
  }

  get isUnresolvableValueLevelAlias() {
    return this._matchIsUnresolvableValueLevelAlias(this.#value);
  }
  get isResolvableValueLevelAlias() {
    return this._matchIsResolvableValueLevelAlias(this.#value);
  }

  /**
   * Allows TypeScript to infer the type of the Value Level Alias.
   * @param type
   */
  ofType<TO extends SpecifyDesignTokenTypeName>(
    type: TO,
  ): InnerValue<RawValueSignature<TO>, RawValueSignature<TO>, TO> {
    return this as any;
  }

  /**
   * Resolve the Value Level Alias to a raw value - returns Unresolvable aliases otherwise.
   */
  resolveDeepValue(): InnerValue<
    Exclude<T, ResolvableValueLevelAlias>,
    InitialRawType,
    TypeOverride
  > {
    if (this._matchIsResolvableValueLevelAlias(this.#value)) {
      const { value: maybeRawValueOrUnresolvableAlias } =
        this.#value.tokenState.resolveDeepStatefulValueForMode(this.#value.targetMode);

      if (maybeRawValueOrUnresolvableAlias instanceof UnresolvableModeLevelAlias) {
        this.#value = new UnresolvableValueLevelAlias({
          localMode: this.#value.localMode,
          valuePath: this.#value.valuePath,
          targetMode: maybeRawValueOrUnresolvableAlias.targetMode,
          targetPath: maybeRawValueOrUnresolvableAlias.targetPath,
        }) as T;
      } else {
        this.#value = maybeRawValueOrUnresolvableAlias as T;
      }
    }

    return this as any;
  }

  /**
   * Map over the Unresolvable Value Level Alias case.
   * @param fn
   */
  mapUnresolvableValueLevelAlias<U>(
    fn: (unresolvableAliasRef: Extract<T, UnresolvableValueLevelAlias>) => U,
  ): InnerValue<Exclude<T, UnresolvableValueLevelAlias> | U, InitialRawType, TypeOverride> {
    if (this._matchIsUnresolvableValueLevelAlias(this.#value)) {
      this.#value = fn(this.#value as any) as any;
    }
    return this as any;
  }

  /**
   * Map over the Resolvable Value Level Alias case.
   * @param fn
   */
  mapResolvableValueLevelAlias<U>(
    fn: (resolvableAliasRef: ResolvableValueLevelAlias<TypeOverride>) => U,
  ): InnerValue<Exclude<T, ResolvableValueLevelAlias> | U, InitialRawType, TypeOverride> {
    if (this._matchIsResolvableValueLevelAlias(this.#value)) {
      this.#value = fn(this.#value as any) as any;
    }
    return this as any;
  }

  /**
   * Map over the raw value case.
   * Important: this method should be called first to avoid re-mapping
   * the mapUnresolvableValueLevelAlias and/or mapResolvableValueLevelAlias
   * returned values.
   * @param fn
   */
  mapPrimitiveValue<U>(
    fn: (value: Exclude<T, ResolvableValueLevelAlias | UnresolvableValueLevelAlias>) => U,
  ): InnerValue<
    Exclude<T, Exclude<T, ResolvableValueLevelAlias | UnresolvableValueLevelAlias>> | U,
    InitialRawType,
    TypeOverride
  > {
    if (
      !this._matchIsResolvableValueLevelAlias(this.#value) &&
      !this._matchIsUnresolvableValueLevelAlias(this.#value)
    ) {
      this.#value = fn(this.#value as any) as any;
    }
    return this as any;
  }

  /**
   * Extract the mapped value.
   */
  unwrap(): T {
    return this.#value as T;
  }

  /**
   * Optimistically extract the mapped primitive value.
   */
  unwrapValue(): Exclude<T, ResolvableValueLevelAlias | UnresolvableValueLevelAlias> {
    if (this._matchIsResolvableValueLevelAlias(this.#value)) {
      throw new SDTFError(
        'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
        `Cannot unwrap raw value of "${this.#value.tokenState.path}" because it is an alias.`,
      );
    }
    if (this._matchIsUnresolvableValueLevelAlias(this.#value)) {
      throw new SDTFError(
        'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
        `Cannot unwrap raw value of "${this.#value.targetPath}" because it is an alias.`,
      );
    }
    return this.#value as any;
  }
}

type SwapAliasSignature<T> = T extends SpecifyModeAndValueLevelAliasSignature
  ? ResolvableValueLevelAlias | UnresolvableValueLevelAlias
  : T extends { [k: PropertyKey]: unknown }
  ? { [k in keyof T]: InnerValue<SwapAliasSignature<T[k]>> }
  : T extends Array<infer U>
  ? Array<InnerValue<SwapAliasSignature<U>>>
  : T;

export type RawValueSignature<Type extends SpecifyDesignTokenTypeName> = SwapAliasSignature<
  Exclude<
    PickSpecifyDesignToken<Type, string, true, false>['$value'],
    SpecifyModeAndValueLevelAliasSignature
  >
>;

export type TopLevelValueSignature<
  Type extends SpecifyDesignTokenTypeName,
  R extends unknown = never,
> = {
  [mode: string]:
    | ResolvableModeLevelAlias<Type>
    | UnresolvableModeLevelAlias
    | RawValueSignature<Type>
    | R;
};

type TokenStateByMode<Type extends SpecifyDesignTokenTypeName> = {
  [localMode: string]: { targetMode: string; tokenState: TokenState<Type> };
};

/**
 * A TopLevelValue is a wrapper around a token value that allows for
 * mapping over the different possible modes and cases of a locally defined token value.
 */
export class TopLevelValue<
  Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
  T extends TopLevelValueSignature<Type, any> = TopLevelValueSignature<Type>,
> {
  readonly tokenState: TokenState<Type>;
  // The first level is the same mode as the #value
  // And the second level mode is the one resolved by `resolveDeepValue`
  #currentTokenStateByMode: TokenStateByMode<Type>;
  #value: T;

  constructor(value: TopLevelValueSignature<Type>, tokenState: TokenState<Type>) {
    this.#value = value as T;
    this.tokenState = tokenState;
    this.#currentTokenStateByMode = Object.keys(value).reduce((acc, mode) => {
      acc[mode] = { targetMode: mode, tokenState };
      return acc;
    }, {} as TokenStateByMode<Type>);
  }

  private _matchIsUnresolvableModeLevelAlias(v: unknown): v is UnresolvableModeLevelAlias {
    return v instanceof UnresolvableModeLevelAlias;
  }
  private _matchIsResolvableModeLevelAlias(v: unknown): v is ResolvableModeLevelAlias<Type> {
    return v instanceof ResolvableModeLevelAlias;
  }
  private _matchIsRawValue(
    v: unknown,
  ): v is Exclude<T, ResolvableModeLevelAlias | UnresolvableModeLevelAlias> {
    return !this._matchIsResolvableModeLevelAlias(v) && !this._matchIsUnresolvableModeLevelAlias(v);
  }

  /**
   * Test whether the token value has a mode.
   * @param mode
   */
  hasMode(mode: string) {
    return this.tokenState.modes.includes(mode);
  }

  /**
   * Filter the token value to only the given mode.
   * This method is primarily a performance optimization
   * to avoid iterating on all modes when only one is needed.
   * @param mode
   */
  focusOnMode(mode: string) {
    if (!this.hasMode(mode)) {
      throw new SDTFError(
        'SDTF_STATEFUL_VALUE_UNKNOWN_MODE',
        `Mode "${mode}" is not defined in token "${this.tokenState.path}"`,
      );
    }
    Object.keys(this.#value).forEach(key => {
      if (key !== mode) Reflect.deleteProperty(this.#value, key);
    });
    return this;
  }

  /**
   * Extract the mapped value for a given mode.
   * @param mode
   */
  pickMode(mode: string): T[number] {
    if (!this.hasMode(mode)) {
      throw new SDTFError(
        'SDTF_STATEFUL_VALUE_UNKNOWN_MODE',
        `Mode "${mode}" is not defined in token "${this.tokenState.path}"`,
      );
    }
    return this.#value[mode] as any;
  }

  /**
   * Map over token value modes.
   * @param f
   */
  mapModes<U>(f: (mode: string) => U): TopLevelValue<Type, { [mode: string]: U }> {
    this.#value = Object.keys(this.#value).reduce((acc, mode) => {
      Reflect.set(acc, mode, f(mode));

      return acc;
    }, this.#value);

    return this as any;
  }

  /**
   * Deeply resolve the token value to a raw value - returns Unresolvable aliases otherwise.
   */
  resolveDeepValue(): TopLevelValue<
    Type,
    {
      [mode: string]: Exclude<T[number], ResolvableModeLevelAlias<Type>>;
    }
  > {
    this.#value = Object.entries(this.#value).reduce((acc, [mode, value]) => {
      if (this._matchIsResolvableModeLevelAlias(value)) {
        const {
          tokenState,
          value,
          targetMode: resolvedMode,
        } = this.tokenState.resolveDeepStatefulValueForMode(mode);

        Reflect.set(acc, mode, value);
        Reflect.set(this.#currentTokenStateByMode, mode, { targetMode: resolvedMode, tokenState });
      }

      return acc;
    }, this.#value);

    return this as any;
  }

  /**
   * Map over the Unresolvable Mode Level Alias case.
   * @param fn
   */
  mapUnresolvableModeLevelAlias<U>(
    fn: (unresolvableAliasRef: Extract<T[number], UnresolvableModeLevelAlias>, mode: string) => U,
  ): TopLevelValue<
    Type,
    {
      [mode: string]: U | Exclude<T[number], UnresolvableModeLevelAlias>;
    }
  > {
    this.#value = Object.entries(this.#value).reduce((acc, [mode, value]) => {
      if (this._matchIsUnresolvableModeLevelAlias(value)) {
        Reflect.set(acc, mode, fn(value as any, mode));
      }
      return acc;
    }, this.#value);

    return this as any;
  }

  /**
   * Map over the Resolvable Mode Level Alias case.
   * @param fn
   */
  mapResolvableModeLevelAlias<U>(
    fn: (resolvableAliasRef: Extract<T[number], ResolvableModeLevelAlias<Type>>, mode: string) => U,
  ): TopLevelValue<
    Type,
    {
      [mode: string]: U | Exclude<T[number], ResolvableModeLevelAlias<Type>>;
    }
  > {
    this.#value = Object.entries(this.#value).reduce((acc, [mode, value]) => {
      if (this._matchIsResolvableModeLevelAlias(value)) {
        Reflect.set(acc, mode, fn(value as any, mode));
      }
      return acc;
    }, this.#value);

    return this as any;
  }

  /**
   * Map over the raw value case.
   * Important: this method should be called first to avoid re-mapping
   * the mapUnresolvableModeLevelAlias and/or mapResolvableModeLevelAlias
   * returned values.
   * @param fn
   */
  mapRawValue<U>(
    fn: (
      rawValue: Exclude<T[number], UnresolvableModeLevelAlias | ResolvableModeLevelAlias<Type>>,
      mode: string,
    ) => U,
  ): TopLevelValue<
    Type,
    {
      [mode: string]: U | Exclude<T[number], RawValueSignature<Type>>;
    }
  > {
    this.#value = Object.entries(this.#value).reduce((acc, [mode, value]) => {
      if (this._matchIsRawValue(value)) {
        Reflect.set(acc, mode, fn(value as any, mode));
      }
      return acc;
    }, this.#value);

    return this as any;
  }

  /**
   * Map over the raw value case and pass the tokenState as well.
   * This method is useful after calling `resolveDeepValue` because the modes might point to a different tokenState
   * than the original. Note that the mode as well will be the one of the resolvedToken.
   * Important: this method should be called first to avoid re-mapping
   * the mapUnresolvableModeLevelAlias and/or mapResolvableModeLevelAlias
   * returned values.
   * @param fn
   */
  mapRawValueWithTokenState<U>(
    fn: (
      rawValue: Exclude<T[number], UnresolvableModeLevelAlias | ResolvableModeLevelAlias<Type>>,
      mode: string,
      tokenState: TokenState<Type>,
    ) => U,
  ): TopLevelValue<
    Type,
    {
      [mode: string]: U | Exclude<T[number], RawValueSignature<Type>>;
    }
  > {
    this.#value = Object.entries(this.#value).reduce((acc, [mode, value]) => {
      if (this._matchIsRawValue(value)) {
        Reflect.set(
          acc,
          mode,
          fn(
            value as any,
            this.#currentTokenStateByMode[mode].targetMode,
            this.#currentTokenStateByMode[mode].tokenState,
          ),
        );
      }
      return acc;
    }, this.#value);

    return this as any;
  }

  /**
   * Reduce the token value to an arbitrary output type.
   * @param f
   * @param initial
   */
  reduce<G>(f: (acc: G, mode: string, value: T[number]) => G, initial: G) {
    return Object.entries(this.#value).reduce((acc, [mode, value]) => f(acc, mode, value), initial);
  }

  /**
   * Extract the mapped value.
   */
  unwrap(): T {
    return this.#value as T;
  }

  /**
   * Optimistically extract the mapped value
   */
  unwrapValue(): {
    [Key in keyof T]: Exclude<T[Key], ResolvableModeLevelAlias<Type> | UnresolvableModeLevelAlias>;
  } {
    return Object.entries(this.#value).reduce((acc, [key, value]) => {
      if (this._matchIsResolvableModeLevelAlias(this.#value[key])) {
        throw new SDTFError(
          'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
          `Cannot unwrap raw value of "${
            this.#value[key].tokenState.path
          }" because it is an alias.`,
        );
      }
      if (this._matchIsUnresolvableModeLevelAlias(this.#value[key])) {
        throw new SDTFError(
          'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
          `Cannot unwrap raw value of "${this.#value[key].targetPath}" because it is an alias.`,
        );
      }

      acc[key] = value;

      return acc;
    }, {} as { [mode: string]: any }) as any;
  }
}

/**
 * A StatefulValueResult is a wrapper around a token value that allows for
 * mapping over the different possible cases of a token value.
 */
export class StatefulValueResult<
  TokenType extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
  T extends unknown =
    | ResolvableTopLevelAlias<TokenType>
    | UnresolvableTopLevelAlias
    | TopLevelValue<TokenType>,
> {
  readonly tokenState: TokenState<TokenType>;
  #value: T;

  constructor(value: T, tokenState: TokenState<TokenType>) {
    this.#value = value as T;
    this.tokenState = tokenState;
  }

  private _matchIsUnresolvableTopLevelAlias(v: unknown): v is UnresolvableTopLevelAlias {
    return v instanceof UnresolvableTopLevelAlias;
  }
  private _matchIsResolvableTopLevelAlias(v: unknown): v is ResolvableTopLevelAlias<TokenType> {
    return v instanceof ResolvableTopLevelAlias;
  }
  private _matchIsTopLevelValue(v: unknown): v is TopLevelValue<TokenType> {
    return v instanceof TopLevelValue;
  }

  get isUnresolvableTopLevelAlias() {
    return this._matchIsUnresolvableTopLevelAlias(this.#value);
  }
  get isResolvableTopLevelAlias() {
    return this._matchIsResolvableTopLevelAlias(this.#value);
  }
  get isTopLevelValue() {
    return this._matchIsTopLevelValue(this.#value);
  }

  /**
   * Deeply resolve the token value to a raw value - returns Unresolvable aliases otherwise.
   */
  resolveDeepValue(): StatefulValueResult<
    TokenType,
    Exclude<T, ResolvableTopLevelAlias<TokenType>>
  > {
    if (this._matchIsResolvableTopLevelAlias(this.#value)) {
      this.#value = this.#value.tokenState.getStatefulValueResult().unwrap() as T;
      this.resolveDeepValue();
    }

    return this as any;
  }

  /**
   * Map over the Unresolvable Top Level Alias case.
   * @param fn
   */
  mapUnresolvableTopLevelAlias<U extends unknown>(
    fn: (topLevelAliasRef: Extract<T, UnresolvableTopLevelAlias>) => U,
  ): StatefulValueResult<TokenType, U | Exclude<T, UnresolvableTopLevelAlias>> {
    if (this._matchIsUnresolvableTopLevelAlias(this.#value)) {
      this.#value = fn(this.#value as any) as any;
    }
    return this as any;
  }

  /**
   * Map over the Resolvable Top Level Alias case.
   * @param fn
   */
  mapResolvableTopLevelAlias<U extends unknown>(
    fn: (topLevelAliasRef: Extract<T, ResolvableTopLevelAlias<TokenType>>) => U,
  ): StatefulValueResult<TokenType, U | Exclude<T, ResolvableTopLevelAlias<TokenType>>> {
    if (this._matchIsResolvableTopLevelAlias(this.#value)) {
      this.#value = fn(this.#value as any) as any;
    }
    return this as any;
  }

  /**
   * Map over the locally defined value of the token wrapped in TopLevelValue.
   * @param fn
   */
  mapTopLevelValue<U extends unknown>(
    fn: (topLevelValue: TopLevelValue<TokenType>) => U,
  ): StatefulValueResult<TokenType, U | Exclude<T, TopLevelValue<TokenType>>> {
    if (this._matchIsTopLevelValue(this.#value)) {
      this.#value = fn(this.#value as any) as any;
    }
    return this as any;
  }

  /**
   * Extract the mapped value
   */
  unwrap(): T {
    return this.#value as T;
  }

  /**
   * Optimistically extract the mapped value at the mode level
   */
  unwrapValue(): Exclude<T, ResolvableTopLevelAlias<TokenType> | UnresolvableTopLevelAlias> {
    if (this._matchIsResolvableTopLevelAlias(this.#value)) {
      throw new SDTFError(
        'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
        `Cannot unwrap raw value of "${this.#value.tokenState.path}" because it is an alias.`,
      );
    }
    if (this._matchIsUnresolvableTopLevelAlias(this.#value)) {
      throw new SDTFError(
        'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
        `Cannot unwrap raw value of "${this.#value.targetPath}" because it is an alias.`,
      );
    }

    return this.#value as any;
  }
}
