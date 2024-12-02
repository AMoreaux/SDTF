import { SpecifyDesignTokenTypeName } from '../../../definitions/index.js';
import { ValuePath } from '../path/ValuePath.js';
import { TokenState } from '../TokenState.js';
import { TreePath } from '../path/TreePath.js';

/* ------------------------------------------
   Top Level Aliasing
--------------------------------------------- */

export class ResolvableTopLevelAlias<
  Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
> {
  readonly _kind = 'ResolvableTopLevelAlias';
  readonly tokenState: TokenState<Type>;

  constructor(params: { tokenState: TokenState<Type> }) {
    this.tokenState = params.tokenState;
  }

  get isFullyResolvable() {
    return this.tokenState.isFullyResolvable;
  }
}

export function matchIsResolvableTopLevelAlias(value: unknown): value is ResolvableTopLevelAlias {
  return value instanceof ResolvableTopLevelAlias;
}

export class UnresolvableTopLevelAlias {
  readonly _kind = 'UnresolvableTopLevelAlias';
  readonly targetPath;

  constructor(params: { targetPath: TreePath }) {
    this.targetPath = params.targetPath;
  }
}

export function matchIsUnresolvableTopLevelAlias(
  value: unknown,
): value is UnresolvableTopLevelAlias {
  return value instanceof UnresolvableTopLevelAlias;
}

/* ------------------------------------------
   Mode Level Aliasing
--------------------------------------------- */

export class ResolvableModeLevelAlias<
  Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
> {
  readonly _kind = 'ResolvableModeLevelAlias';
  readonly localMode;
  readonly targetMode;
  readonly tokenState: TokenState<Type>;

  constructor(params: { localMode: string; targetMode: string; tokenState: TokenState<Type> }) {
    this.localMode = params.localMode;
    this.targetMode = params.targetMode;
    this.tokenState = params.tokenState;
  }

  get isFullyResolvable() {
    return this.tokenState.modesResolvability[this.targetMode] === true;
  }
}

export function matchIsResolvableModeLevelAlias(value: unknown): value is ResolvableModeLevelAlias {
  return value instanceof ResolvableModeLevelAlias;
}

export class UnresolvableModeLevelAlias {
  readonly _kind = 'UnresolvableModeLevelAlias';
  readonly localMode;
  readonly targetMode;
  readonly targetPath;

  constructor(params: { localMode: string; targetMode: string; targetPath: TreePath }) {
    this.localMode = params.localMode;
    this.targetMode = params.targetMode;
    this.targetPath = params.targetPath;
  }
}

export function matchIsUnresolvableModeLevelAlias(
  value: unknown,
): value is UnresolvableModeLevelAlias {
  return value instanceof UnresolvableModeLevelAlias;
}

/* ------------------------------------------
   Value Level Aliasing
--------------------------------------------- */

export class ResolvableValueLevelAlias<
  Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
> {
  readonly _kind = 'ResolvableValueLevelAlias';
  readonly localMode;
  readonly valuePath;
  readonly targetMode;
  readonly tokenState: TokenState<Type>;

  constructor(params: {
    localMode: string;
    valuePath: ValuePath;
    targetMode: string;
    tokenState: TokenState<Type>;
  }) {
    this.localMode = params.localMode;
    this.valuePath = params.valuePath;
    this.targetMode = params.targetMode;
    this.tokenState = params.tokenState;
  }

  get isFullyResolvable() {
    return this.tokenState.modesResolvability[this.targetMode] === true;
  }
}

export function matchIsResolvableValueLevelAlias(
  value: unknown,
): value is ResolvableValueLevelAlias {
  return value instanceof ResolvableValueLevelAlias;
}

export class UnresolvableValueLevelAlias {
  readonly _kind = 'UnresolvableValueLevelAlias';
  readonly localMode;
  readonly valuePath;
  readonly targetMode;
  readonly targetPath;

  constructor(params: {
    localMode: string;
    valuePath: ValuePath;
    targetMode: string;
    targetPath: TreePath;
  }) {
    this.localMode = params.localMode;
    this.valuePath = params.valuePath;
    this.targetMode = params.targetMode;
    this.targetPath = params.targetPath;
  }
}

export function matchIsUnresolvableValueLevelAlias(
  value: unknown,
): value is UnresolvableValueLevelAlias {
  return value instanceof UnresolvableValueLevelAlias;
}
