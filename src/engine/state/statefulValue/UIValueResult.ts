import {
  PickSpecifyDesignToken,
  SpecifyDesignTokenTypeName,
  SpecifyModeAndValueLevelAliasSignature,
} from '../../../definitions/index.js';
import {
  ResolvableModeLevelAlias,
  ResolvableTopLevelAlias,
  ResolvableValueLevelAlias,
  UnresolvableModeLevelAlias,
  UnresolvableTopLevelAlias,
  UnresolvableValueLevelAlias,
} from './aliasing.js';

type SwapUIAliasSignature<T> = T extends SpecifyModeAndValueLevelAliasSignature
  ? ResolvableValueLevelAlias | UnresolvableValueLevelAlias
  : T extends { [k: PropertyKey]: unknown }
  ? { [k in keyof T]: SwapUIAliasSignature<T[k]> }
  : T extends Array<infer U>
  ? Array<SwapUIAliasSignature<U>>
  : T;

export type RawUIValueSignature<Type extends SpecifyDesignTokenTypeName> = SwapUIAliasSignature<
  Exclude<
    PickSpecifyDesignToken<Type, string, true, false>['$value'],
    SpecifyModeAndValueLevelAliasSignature
  >
>;

export type ModeLevelUIValueSignature<Type extends SpecifyDesignTokenTypeName> =
  | ResolvableModeLevelAlias<Type>
  | UnresolvableModeLevelAlias
  | RawUIValueSignature<Type>;

export type UIValueSignature<Type extends SpecifyDesignTokenTypeName> =
  | ResolvableTopLevelAlias<Type>
  | UnresolvableTopLevelAlias
  | ModeLevelUIValueSignature<Type>;

export type UIValueResultSignature<Type extends SpecifyDesignTokenTypeName> =
  | UnknownModeUIValue
  | UIValueSignature<Type>;

export class UnknownModeUIValue {
  readonly _kind: 'UnknownUIValueMode' = 'UnknownUIValueMode';
  public readonly mode: string;
  constructor(mode: string) {
    this.mode = mode;
  }
}

export function matchIsUnknownUIValueMode(value: unknown): value is UnknownModeUIValue {
  return value instanceof UnknownModeUIValue;
}
