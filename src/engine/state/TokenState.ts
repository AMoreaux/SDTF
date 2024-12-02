import { ValuePath } from './path/ValuePath.js';
import { TreeNodeInterface, TreeNodeState } from './TreeNodeState.js';
import { DesignTokenDefinition } from '../../definitions/internals/createDesignTokenDefinition.js';
import {
  SpecifyDesignTokenSignature,
  SpecifyDesignTokenValueWithMode,
} from '../../definitions/internals/designTokenSignature.js';
import {
  matchIsModeAndValueLevelAliasSignature,
  matchIsTopLevelAliasSignature,
  PickSpecifyDesignToken,
  SpecifyBorderValue,
  SpecifyColorValue,
  SpecifyDesignTokenTypeName,
  specifyDesignTokenValueModeSchema,
  SpecifyGradientValue,
  SpecifyModeAndValueLevelAliasSignature,
  SpecifyTransitionValue,
} from '../../definitions/index.js';
import { SDTFError } from '../../errors/index.js';
import { traverseJSONValue } from '../../utils/traverseJSONValue.js';
import { matchHasIdenticalModes } from '../utils/modes.js';
import { pickInObject } from '../utils/pickInObject.js';
import { createValueToTraverseFromPrefix } from '../utils/createValueToTraverseFromPrefix.js';
import { TreeState } from './TreeState.js';
import { TreeNodeExtensions } from '../../definitions/internals/designTokenTree.js';
import { TokenRawValueParts } from './TokenRawValueParts.js';
import { JSONValue } from '../../utils/JSONDefinitions.js';
import { deepSetJSONValue } from '../../utils/deepSetJSONValue.js';
import {
  InnerValue,
  RawValueSignature,
  StatefulValueResult,
  TopLevelValue,
  TopLevelValueSignature,
} from './statefulValue/StatefulValueResult.js';
import { TokenValuePaths } from './statefulValue/TokenValuePaths.js';
import {
  ResolvableModeLevelAlias,
  ResolvableTopLevelAlias,
  ResolvableValueLevelAlias,
  UnresolvableModeLevelAlias,
  UnresolvableTopLevelAlias,
  UnresolvableValueLevelAlias,
} from './statefulValue/aliasing.js';
import {
  UIValueResultSignature,
  UIValueSignature,
  UnknownModeUIValue,
} from './statefulValue/UIValueResult.js';
import { AnalyzedSDTFNode } from '../parser/internals/AnalyzedSDTFNode.js';
import { AnalyzedToken } from '../parser/internals/parseRawToken.js';
import {
  AnalyzedTokenValueAliasPart,
  AnalyzedTokenValuePrimitivePart,
} from '../parser/internals/AnalyzedTokenValuePart.js';
import * as designTokenTypeNames from '../../definitions/designTokenTypeNames.js';
import { deepClone } from '../utils/deepClone.js';
import { specifyColorDefinition } from '../../definitions/tokenTypes/color.js';
import {
  specifyGradientDefinition,
  specifyGradientPartialAlisableValueColorStops,
} from '../../definitions/tokenTypes/gradient.js';
import { specifyCubicBezierDefinition } from '../../definitions/tokenTypes/cubicBezier.js';
import { specifyStepsTimingFunctionDefinition } from '../../definitions/tokenTypes/stepsTimingFunction.js';
import { borderStyleDefinition } from '../../definitions/tokenTypes/borderStyle.js';
import { TreePath } from './path/TreePath.js';

type TokenStateValueResolutionResult =
  | {
      status: 'unresolvable';
      treePath: Array<string>;
      unresolvableReason: string;
      localMode: string | null;
      valuePath: ValuePath;
      targetMode: string | null;
    }
  | {
      status: 'resolved';
      tokenState: TokenState;
      localMode: string | null;
      valuePath: ValuePath;
      targetMode: string | null;
    }
  | {
      status: 'raw';
      localMode: string;
      valuePath: ValuePath;
      value: JSONValue;
    };

export type ResolvedDeepStatefulValueForMode<
  Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
> = {
  tokenState: TokenState<Type>;
  targetMode: string;
  value: UnresolvableModeLevelAlias | RawValueSignature<Type>;
};

export type UpdateOptions = {
  overrideAliases?: boolean;
  allowModeCreation?: boolean;
};

type RequiredUpdateOptions = Required<UpdateOptions>;

export const defaultGetJSONTokenValueOptions = {
  resolveAliases: true,
  allowUnresolvable: true,
  targetMode: null,
} as const;
export type GetJSONTokenValueOptions<
  ResolveAliases extends boolean = boolean,
  AllowUnresolvable extends boolean = boolean,
  TargetMode extends string | null = null,
> = ResolveAliases extends true
  ? {
      resolveAliases: true;
      allowUnresolvable?: AllowUnresolvable;
      targetMode?: TargetMode;
    }
  : { resolveAliases: false };

export function mergeGetJSONTokenValueOptions<
  ResolveAliases extends boolean,
  AllowUnresolvable extends boolean,
  TargetMode extends string | null,
>(candidate: GetJSONTokenValueOptions<ResolveAliases, AllowUnresolvable, TargetMode> = {} as any) {
  return {
    ...defaultGetJSONTokenValueOptions,
    ...(candidate.resolveAliases === true && candidate),
    ...(candidate.resolveAliases === false && { resolveAliases: false }),
  } as Required<GetJSONTokenValueOptions<true, AllowUnresolvable, TargetMode>>;
}

export type TokenStateParams<Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName> =
  AnalyzedSDTFNode & {
    // Token data
    $type: Type;
    $description: string | undefined;
    $extensions: TreeNodeExtensions | undefined;
    // Analyzed data
    definition: DesignTokenDefinition<string>;
    isTopLevelAlias: boolean;
    analyzedValuePrimitiveParts: Array<AnalyzedTokenValuePrimitivePart>;
    // Post process data
    isFullyResolvable: boolean;
    modesResolvabilityMap: Map<string, boolean>;
  };

export class TokenState<
    Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
    Value extends unknown = unknown,
    Mode extends string = string,
  >
  extends TreeNodeState
  implements TreeNodeInterface
{
  readonly isToken = true;
  readonly isGroup = false;
  readonly isCollection = false;
  readonly #rawValueParts = new TokenRawValueParts<Value>();
  readonly #definition: DesignTokenDefinition<Type>;
  readonly #type: Type;
  #isTopLevelAlias: boolean = false;
  #isFullyResolvable: boolean = true;

  #modesResolvabilityMap: Map<string, boolean>;
  #sortedModes: Array<string>;

  constructor(
    treeState: TreeState,
    {
      path,
      name,
      $description,
      $extensions,
      $type,
      definition,
      isTopLevelAlias,
      analyzedValuePrimitiveParts,
      isFullyResolvable,
      modesResolvabilityMap,
    }: TokenStateParams<Type>,
  ) {
    super(treeState, { path, name, $description, $extensions });

    this.#type = $type;
    this.#definition = definition as DesignTokenDefinition<Type>;
    this.#isTopLevelAlias = isTopLevelAlias;

    this.#isFullyResolvable = isFullyResolvable;
    this.#modesResolvabilityMap = new Map(modesResolvabilityMap);

    this.#sortedModes = this.#computeSortedModes();

    for (let i = 0; i < analyzedValuePrimitiveParts.length; i++) {
      const part = analyzedValuePrimitiveParts[i];

      this.#rawValueParts.add({
        mode: part.localMode,
        valuePath: part.valuePath.clone(),
        value: deepClone(part.value),
      });
    }
  }

  #computeSortedModes() {
    this.#sortedModes = Array.from(this.#modesResolvabilityMap.keys()).sort((a, b) => {
      return a.localeCompare(b);
    });

    return this.#sortedModes;
  }

  get aliases() {
    return this.treeState.getStatefulAliasReferencesFrom({ treePath: this.path });
  }

  #resolveModes(): Array<string> {
    if (this.#isTopLevelAlias) {
      const statefulAliasResult = this.treeState.getStatefulAliasReference({
        treePath: this.path,
        valuePath: ValuePath.empty(),
        mode: null,
      });

      if (statefulAliasResult.status === 'resolved') {
        return statefulAliasResult.tokenState.#resolveModes();
      } else {
        return [];
      }
    }

    return [...this.#sortedModes];
  }

  #getLocalModes() {
    return this.#sortedModes;
  }

  #resolveValue(mode: string | null): SpecifyDesignTokenValueWithMode<Value, Mode> {
    let clonedValue = deepClone(this.value);

    if (this.#isTopLevelAlias) {
      const statefulAliasReference = this.treeState.getStatefulAliasReference({
        treePath: this.path,
        valuePath: ValuePath.empty(),
        mode: null,
      });

      if (statefulAliasReference.status === 'resolved') {
        return statefulAliasReference.tokenState.#resolveValue(
          mode,
        ) as SpecifyDesignTokenValueWithMode<Value, Mode>;
      } else {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `Could not find token "${'$alias' in clonedValue ? clonedValue.$alias : 'Unknown'}".`,
        );
      }
    }

    this.treeState
      .getStatefulAliasReferencesFrom(
        {
          treePath: this.path,
        },
        { isResolvable: true },
      )
      .forEach(statefulReference => {
        const valuePath = statefulReference.from.valuePath;
        const localMode = statefulReference.from.mode;
        const targetMode = statefulReference.to.mode;

        // We do not apply the value if the mode is not the one we are looking for
        if (mode !== null && mode !== localMode) {
          return;
        }

        const objectPath =
          localMode !== null ? [localMode, ...valuePath.toArray()] : valuePath.toArray();
        const value = statefulReference.tokenState.#resolveValue(targetMode);

        if (objectPath.length === 0) {
          clonedValue = value as any;
        } else {
          deepSetJSONValue(clonedValue, objectPath, value);
        }
      });

    if (typeof mode === 'string' && Reflect.has(clonedValue, mode)) {
      return Reflect.get(clonedValue, mode) as SpecifyDesignTokenValueWithMode<Value, Mode>;
    }

    return clonedValue as SpecifyDesignTokenValueWithMode<Value, Mode>;
  }

  /**
   * Validate the all the values and aliases are correct.
   * If not, it'll throw an error
   */
  public validateValue() {
    // We validate the raw values and shape of aliases
    const { $value } = this.#definition.aliasableTokenZodSchema
      .pick({ $value: true })
      .parse({ $value: this.value }) as SpecifyDesignTokenSignature<Type, Value, Mode>;

    // We validate the bound of aliases
    this.#validateAliasReferences($value);

    const maybeCollection = this.getCollection();

    if (
      maybeCollection &&
      [...maybeCollection.allowedModes].sort().join() !== [...this.modes].sort().join()
    ) {
      const modesDiff = this.modes.filter(mode => !maybeCollection.allowedModes.includes(mode));

      // The only state where a token can have a mode that is not in `allowedModes`
      // is when we are deleting a mode from a collection
      throw new SDTFError(
        'SDTF_VALIDATION_ERROR',
        `Couldn't match mode${modesDiff.length > 1 ? 's' : ''} ${modesDiff
          .map(v => `"${v}"`)
          .join(
            ', ',
          )} on token "${this.path.toString()}" that belongs to collection "${maybeCollection.path.toString()}" where modes are: ${maybeCollection.allowedModes
          .map(c => `"${c}"`)
          .join(', ')}`,
      );
    }
  }

  // TODO: Refactor to remove the need of a nextValue
  #validateAliasReferences(nextValue: SpecifyDesignTokenValueWithMode<Value, Mode>) {
    // Top level alias
    if (matchIsTopLevelAliasSignature(nextValue)) {
      const path = TreePath.fromString(nextValue.$alias);
      const maybeTokenState = this.treeState.getTokenState(path, { withView: null });

      if (maybeTokenState) {
        const matchResult = this.#definition.matchTokenTypeAgainstMapping(
          maybeTokenState.#type,
          ValuePath.empty(),
          _discriminatorKeyPath => {
            /* v8 ignore start */
            throw new SDTFError(
              'SDTF_INTERNAL_DESIGN_ERROR',
              'Discriminator key path should not be triggered on top level aliases',
            );
          },
          /* v8 ignore stop */
        );

        if (!matchResult.success) {
          throw new SDTFError(
            'SDTF_INVALID_ALIAS_TYPE_REFERENCED',
            `Alias "${maybeTokenState.path.toString()}" on token "${this.path}" is of type "${
              maybeTokenState.#type
            }" but should be of type "${matchResult.expectedType}"`,
          );
        }
      }
    } else {
      // Rest of possible values per mode
      Object.entries(nextValue).forEach(([parentMode, modeValue]) => {
        this.#modesResolvabilityMap.set(parentMode, true);
        traverseJSONValue(modeValue as JSONValue, (data, valuePath) => {
          if (matchIsModeAndValueLevelAliasSignature(data)) {
            // mode level alias
            const path = TreePath.fromString(data.$alias);
            const maybeTokenState = this.treeState.getTokenState(path, { withView: null });

            if (maybeTokenState) {
              const matchResult = this.#definition.matchTokenTypeAgainstMapping(
                maybeTokenState.#type,
                new ValuePath(valuePath),
                discriminatorKeyPath => {
                  const computedPath = [parentMode, ...discriminatorKeyPath];
                  return pickInObject(nextValue as object, computedPath);
                },
              );

              if (!matchResult.success) {
                throw new SDTFError(
                  'SDTF_INVALID_ALIAS_TYPE_REFERENCED',
                  `Alias "${maybeTokenState.path.toString()}" on token "${this.path.toString()}" is of type "${
                    maybeTokenState.#type
                  }" but should be of type "${matchResult.expectedType}"`,
                );
              }
            } else {
              this.#modesResolvabilityMap.set(parentMode, false);
            }

            return false;
          }

          // If data is non-empty array or object, we continue traversing
          if (
            data !== null &&
            ((Array.isArray(data) && data.length > 0) ||
              (typeof data === 'object' && Object.keys(data).length > 0))
          ) {
            return true;
          }

          return false;
        });
      });
    }

    this.#isFullyResolvable = [...this.#modesResolvabilityMap.values()].reduce(
      (acc, curr) => acc && curr,
      true,
    );
    this.#computeSortedModes();
  }

  /**
   * Get the Token type
   * @public
   */
  public get type(): Type {
    return this.#type;
  }

  /**
   * Get the SDTF JSON representation of the Token value
   * @public
   */
  public get value(): PickSpecifyDesignToken<Type>['$value'] {
    if (this.#isTopLevelAlias) {
      const reference = this.treeState.getAliasReference({
        treePath: this.path,
        valuePath: ValuePath.empty(),
        mode: null,
      });
      /* v8 ignore next 6 */
      if (!reference) {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `Token "${this.path.toString()}" is a top level alias but has no reference`,
        );
      }
      return {
        $alias: reference.to.treePath.toString(),
      };
    }

    const rawValue = this.#rawValueParts.toObject();

    // We want to return the raw value along with the latest state of aliasReferences
    this.treeState.getAliasReferencesFrom({ treePath: this.path }).forEach(reference => {
      const completePath = reference.from.mode
        ? [reference.from.mode, ...reference.from.valuePath.toArray()]
        : reference.from.valuePath;
      deepSetJSONValue(
        // @ts-expect-error - rawValue type is not narrowing on Record<string, unknown>
        rawValue,
        completePath,
        {
          $alias: reference.to.treePath.toString(),
          $mode: reference.to.mode,
        },
      );
    });

    return rawValue as PickSpecifyDesignToken<Type>['$value'];
  }

  /**
   * Get the Token resolved modes
   * @public
   */
  public get modes() {
    return this.#resolveModes();
  }

  /**
   * Get the Token resolved modes
   * @deprecated Use `this.modes` instead.
   */
  public getModes() {
    return this.#resolveModes();
  }

  /**
   * Indicates whether the Token is a top level alias
   */
  public get isTopLevelAlias() {
    return this.#isTopLevelAlias;
  }

  /**
   * Indicates whether the Token holds unresolvable aliases
   */
  public get isFullyResolvable() {
    return this.#isFullyResolvable;
  }

  /**
   * Get a map representation of whether the token holds unresolvable aliases per mode
   */
  public get modesResolvability(): Record<string, boolean> {
    if (this.#isTopLevelAlias) {
      const statefulAliasReference = this.treeState.getStatefulAliasReference({
        treePath: this.path,
        valuePath: ValuePath.empty(),
        mode: null,
      });

      if (statefulAliasReference.status === 'resolved') {
        return statefulAliasReference.tokenState.modesResolvability;
      }
      return {};
    }
    return Array.from(this.#modesResolvabilityMap.entries()).reduce(
      (acc, [mode, isResolvable]) => {
        acc[mode] = isResolvable;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }

  /**
   * Get the design token definition - containing validation schemas of the token
   */
  public get definition(): DesignTokenDefinition<Type> {
    return this.#definition;
  }

  /**
   * Get the parent collection of the token if any
   */
  public getCollection() {
    return this.treeState.getNearestCollectionState(this.path.toString());
  }

  /**
   * get a StatefulValueResult instance allowing to map over the token possible values for modes and aliases.
   */
  public getStatefulValueResult(): StatefulValueResult<Type> {
    // Manage top level alias
    if (this.isTopLevelAlias) {
      const references = this.treeState.getStatefulAliasReferencesFrom({ treePath: this.path });
      if (references.length !== 1) {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `Top level alias "${this.path.toString()}" should have exactly one reference but has ${
            references.length
          }`,
        );
      }
      const topLevelAliasReference = references[0];
      if (topLevelAliasReference.status === 'resolved') {
        return new StatefulValueResult(
          new ResolvableTopLevelAlias<Type>({
            tokenState: topLevelAliasReference.tokenState as any,
          }),
          this as any,
        );
      }
      return new StatefulValueResult(
        new UnresolvableTopLevelAlias({
          targetPath: topLevelAliasReference.to.treePath,
        }),
        this as any,
      );
    }

    // Manage local value
    let topLevelValueAccumulator: TopLevelValueSignature<Type> = {};
    const tokenValuePaths = new TokenValuePaths();

    // Raw value parts
    this.#rawValueParts.getAll().forEach(valuePart => {
      // Collect value paths
      tokenValuePaths.addLeaf([valuePart.mode, ...valuePart.valuePath.toArray()]);

      deepSetJSONValue(
        // @ts-expect-error - abusing type
        topLevelValueAccumulator,
        [valuePart.mode, ...valuePart.valuePath.toArray()],
        valuePart.valuePath.length === 0
          ? valuePart.value
          : new InnerValue(valuePart.value, this as any),
      );
    });

    // Alias references
    this.treeState
      .getStatefulAliasReferencesFrom({ treePath: this.path })
      .forEach(statefulAliasReferenceResult => {
        if (typeof statefulAliasReferenceResult.from.mode !== 'string') {
          throw new SDTFError(
            'SDTF_INTERNAL_DESIGN_ERROR',
            `Local mode should be a string, received: ${statefulAliasReferenceResult.from.mode}`,
          );
        }
        if (typeof statefulAliasReferenceResult.to.mode !== 'string') {
          throw new SDTFError(
            'SDTF_INTERNAL_DESIGN_ERROR',
            `Target mode should be a string, received: ${statefulAliasReferenceResult.to.mode}`,
          );
        }

        // Collect value paths for value level alias
        if (statefulAliasReferenceResult.from.valuePath.length > 0) {
          tokenValuePaths.addLeaf([
            statefulAliasReferenceResult.from.mode,
            ...statefulAliasReferenceResult.from.valuePath.toArray(),
          ]);
        }

        const valuePath = statefulAliasReferenceResult.from.valuePath;
        const localMode = statefulAliasReferenceResult.from.mode;
        const targetPath = statefulAliasReferenceResult.to.treePath;
        const targetMode = statefulAliasReferenceResult.to.mode;
        const isModeLevelAlias = valuePath.length === 0;
        const objectPath = [localMode, ...valuePath.toArray()];

        const aliasValue =
          statefulAliasReferenceResult.status === 'resolved'
            ? isModeLevelAlias
              ? new ResolvableModeLevelAlias({
                  localMode,
                  targetMode,
                  tokenState: statefulAliasReferenceResult.tokenState,
                })
              : new ResolvableValueLevelAlias({
                  localMode,
                  valuePath,
                  targetMode,
                  tokenState: statefulAliasReferenceResult.tokenState,
                })
            : isModeLevelAlias
              ? new UnresolvableModeLevelAlias({
                  localMode,
                  targetMode,
                  targetPath,
                })
              : new UnresolvableValueLevelAlias({
                  localMode,
                  valuePath,
                  targetMode,
                  targetPath,
                });

        deepSetJSONValue(
          // @ts-expect-error - abusing type
          topLevelValueAccumulator,
          objectPath,
          isModeLevelAlias ? aliasValue : new InnerValue(aliasValue, this as any),
        );
      });

    // Analyze the value branches to place InnerRawValue
    tokenValuePaths.computeLeafParentPaths().forEach(branchPath => {
      // Do not place InnerRawValue on Top / Mode level - only on nested values
      if (branchPath.length < 2) return;

      const branchContent = pickInObject(topLevelValueAccumulator, branchPath);
      deepSetJSONValue(
        // @ts-expect-error - abusing type
        topLevelValueAccumulator,
        branchPath,
        new InnerValue(branchContent, this as any),
      );
    });

    return new StatefulValueResult(
      new TopLevelValue(topLevelValueAccumulator, this as TokenState<Type>),
      this as TokenState<Type>,
    );
  }

  /**
   * Resolve the stateful value for a given mode
   * @param mode
   */
  public resolveDeepStatefulValueForMode<T extends SpecifyDesignTokenTypeName = Type>(
    mode: string,
  ): ResolvedDeepStatefulValueForMode<T> {
    // Manage top level alias
    if (this.isTopLevelAlias) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        `resolveDeepStatefulValueForMode can't be called from a topLevelAlias`,
      );
    }

    const statefulAliasReference = this.treeState.getStatefulAliasReference({
      treePath: this.path,
      valuePath: ValuePath.empty(),
      mode,
    });

    if (
      statefulAliasReference.status === 'unresolvable' &&
      // getStatefulAliasReference returns unresolvable + an empty treePath when mode is not an alias
      statefulAliasReference.to.treePath.length === 0
    ) {
      const tokenValuePaths = new TokenValuePaths();
      const accumulator: TopLevelValueSignature<Type> = {};

      this.#rawValueParts.getAll().forEach(valuePart => {
        if (valuePart.mode !== mode) return;

        // Collect value paths
        tokenValuePaths.addLeaf([valuePart.mode, ...valuePart.valuePath.toArray()]);

        deepSetJSONValue(
          // @ts-expect-error - abusing type
          accumulator,
          [valuePart.mode, ...valuePart.valuePath.toArray()],
          valuePart.valuePath.length === 0
            ? valuePart.value
            : new InnerValue(valuePart.value, this as any),
        );
      });

      this.treeState
        .getStatefulAliasReferencesFrom({ treePath: this.path, mode })
        .forEach(statefulAliasReferenceResult => {
          if (typeof statefulAliasReferenceResult.from.mode !== 'string') {
            throw new SDTFError(
              'SDTF_INTERNAL_DESIGN_ERROR',
              `Local mode should be a string, received: ${statefulAliasReferenceResult.from.mode}`,
            );
          }
          if (typeof statefulAliasReferenceResult.to.mode !== 'string') {
            throw new SDTFError(
              'SDTF_INTERNAL_DESIGN_ERROR',
              `Target mode should be a string, received: ${statefulAliasReferenceResult.to.mode}`,
            );
          }

          // Collect value paths for value level alias
          if (statefulAliasReferenceResult.from.valuePath.length > 0) {
            tokenValuePaths.addLeaf([
              statefulAliasReferenceResult.from.mode,
              ...statefulAliasReferenceResult.from.valuePath.toArray(),
            ]);
          }

          const valuePath = statefulAliasReferenceResult.from.valuePath;
          const localMode = statefulAliasReferenceResult.from.mode;
          const targetPath = statefulAliasReferenceResult.to.treePath;
          const targetMode = statefulAliasReferenceResult.to.mode;
          const objectPath = [localMode, ...valuePath.toArray()];

          deepSetJSONValue(
            // @ts-expect-error - abusing type
            accumulator,
            objectPath,
            new InnerValue(
              statefulAliasReferenceResult.status === 'resolved'
                ? new ResolvableValueLevelAlias({
                    localMode,
                    valuePath,
                    targetMode,
                    tokenState: statefulAliasReferenceResult.tokenState,
                  })
                : new UnresolvableValueLevelAlias({
                    localMode,
                    valuePath,
                    targetMode,
                    targetPath,
                  }),
              this as any,
            ),
          );
        });

      // Analyze the value branches to place InnerRawValue
      tokenValuePaths.computeLeafParentPaths().forEach(branchPath => {
        // Do not place InnerRawValue on Top / Mode level - only on nested values
        if (branchPath.length < 2) return;

        const branchContent = pickInObject(accumulator, branchPath);
        deepSetJSONValue(
          // @ts-expect-error - abusing type
          accumulator,
          branchPath,
          new InnerValue(branchContent, this as any),
        );
      });

      return {
        targetMode: mode,
        // @ts-expect-error - `this` is a `TokenState` but ts doesn't want to generalize it, even with casting
        tokenState: this,
        value: accumulator[mode] as any,
      };
    } else if (statefulAliasReference.status === 'unresolvable') {
      if (!statefulAliasReference.to.mode) {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `getDeepStatefulModeLevelAlias mode target was null`,
        );
      }

      return {
        targetMode: mode,
        // @ts-expect-error - `this` is a `TokenState` but ts doesn't want to generalize it, even with casting
        tokenState: this,
        value: new UnresolvableModeLevelAlias({
          localMode: mode,
          targetMode: statefulAliasReference.to.mode,
          targetPath: statefulAliasReference.to.treePath,
        }),
      };
    } else {
      if (!statefulAliasReference.to.mode) {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `getDeepStatefulModeLevelAlias mode target was null`,
        );
      }

      return statefulAliasReference.tokenState.resolveDeepStatefulValueForMode(
        statefulAliasReference.to.mode,
      );
    }
  }

  /**
   * Get the Stateful Value representation for frontend usage
   * @param targetMode
   */
  public getUIValueResultOnMode(targetMode: string): UIValueResultSignature<Type> {
    if (typeof targetMode !== 'string') {
      throw new SDTFError(
        'SDTF_INVALID_OPTION',
        `targetMode should be a string, received: "${targetMode}"`,
      );
    }

    // Manage top level alias
    if (this.isTopLevelAlias) {
      const references = this.treeState.getStatefulAliasReferencesFrom({ treePath: this.path });
      /* v8 ignore next 6 */
      if (references.length !== 1) {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `Top level alias "${this.path.toString()}" should have exactly one reference but has ${
            references.length
          }`,
        );
      }
      const topLevelAliasReference = references[0];
      if (topLevelAliasReference.status === 'resolved') {
        return new ResolvableTopLevelAlias<Type>({
          tokenState: topLevelAliasReference.tokenState as any,
        });
      }
      return new UnresolvableTopLevelAlias({
        targetPath: topLevelAliasReference.to.treePath,
      });
    }

    // Token does not have the given mode
    if (!this.modes.includes(targetMode)) {
      return new UnknownModeUIValue(targetMode);
    }

    // Manage local value
    const accumulatorPrefix = 'data';
    let topLevelValueAccumulator: { [k in typeof accumulatorPrefix]: UIValueSignature<Type> } = {
      // @ts-expect-error - initial value is not part of the type
      data: undefined,
    };

    // Raw value parts for given targetMode
    this.#rawValueParts.getAll().forEach(valuePart => {
      if (valuePart.mode === targetMode) {
        deepSetJSONValue(
          // @ts-expect-error - abusing type
          topLevelValueAccumulator,
          [accumulatorPrefix, ...valuePart.valuePath.toArray()],
          valuePart.value,
        );
      }
    });

    // Alias references
    this.treeState
      .getStatefulAliasReferencesFrom({ treePath: this.path, mode: targetMode })
      .forEach(statefulAliasReferenceResult => {
        /* v8 ignore next 12 */
        if (typeof statefulAliasReferenceResult.from.mode !== 'string') {
          throw new SDTFError(
            'SDTF_INTERNAL_DESIGN_ERROR',
            `Local mode should be a string, received: ${statefulAliasReferenceResult.from.mode}`,
          );
        }
        if (typeof statefulAliasReferenceResult.to.mode !== 'string') {
          throw new SDTFError(
            'SDTF_INTERNAL_DESIGN_ERROR',
            `Target mode should be a string, received: ${statefulAliasReferenceResult.to.mode}`,
          );
        }

        const valuePath = statefulAliasReferenceResult.from.valuePath;
        const localMode = statefulAliasReferenceResult.from.mode;
        const targetPath = statefulAliasReferenceResult.to.treePath;
        const targetMode = statefulAliasReferenceResult.to.mode;
        const isModeLevelAlias = valuePath.length === 0;

        const aliasValue =
          statefulAliasReferenceResult.status === 'resolved'
            ? isModeLevelAlias
              ? new ResolvableModeLevelAlias({
                  localMode,
                  targetMode,
                  tokenState: statefulAliasReferenceResult.tokenState,
                })
              : new ResolvableValueLevelAlias({
                  localMode,
                  valuePath,
                  targetMode,
                  tokenState: statefulAliasReferenceResult.tokenState,
                })
            : isModeLevelAlias
              ? new UnresolvableModeLevelAlias({
                  localMode,
                  targetMode,
                  targetPath,
                })
              : new UnresolvableValueLevelAlias({
                  localMode,
                  valuePath,
                  targetMode,
                  targetPath,
                });

        deepSetJSONValue(
          // @ts-expect-error - abusing type
          topLevelValueAccumulator,
          [accumulatorPrefix, ...valuePath.toArray()],
          aliasValue,
        );
      });

    return topLevelValueAccumulator.data;
  }

  /**
   * Rename the token
   * @param newName
   */
  public rename(newName: string) {
    const previousPath = this.path.clone();
    const hasBeenRenamed = super.rename(newName);

    if (!hasBeenRenamed) {
      return false;
    }

    // Rename reference from this token
    this.treeState.getAliasReferencesFrom({ treePath: previousPath }).forEach(reference => {
      this.treeState.updateAliasReference(reference.from, {
        ...reference,
        from: {
          ...reference.from,
          treePath: this.path,
        },
      });
    });

    // Rename reference to this token
    this.treeState.getAliasReferencesTo({ treePath: previousPath }).forEach(reference => {
      this.treeState.updateAliasReference(reference.from, {
        ...reference,
        to: {
          ...reference.to,
          treePath: this.path,
        },
      });
    });

    return true;
  }

  /**
   * Rename a mode of the token
   * @param fromMode
   * @param toMode
   */
  public renameMode(fromMode: string, toMode: string) {
    const parsedToMode = specifyDesignTokenValueModeSchema.parse(toMode, {
      path: this.path.toArray(),
    });

    if (this.#isTopLevelAlias) {
      const maybeAliasReference = this.treeState.getAliasReference({
        treePath: this.path,
        valuePath: ValuePath.empty(),
        mode: null,
      });
      /* v8 ignore next 8 */
      if (!maybeAliasReference) {
        throw new SDTFError(
          'SDTF_MODE_RENAME_FAILED',
          `Cannot rename the modes of the non-resolvable top level alias token "${this.path}"`,
        );
      }
      if (maybeAliasReference.isResolvable) {
        const maybeTokenState = this.treeState.getTokenState(maybeAliasReference.to.treePath);
        if (maybeTokenState) {
          maybeTokenState.renameMode(fromMode, parsedToMode);
          return;
        }
      } else {
        throw new SDTFError(
          'SDTF_MODE_RENAME_FAILED',
          `Cannot rename the modes of the non-resolvable top level alias: "${maybeAliasReference.to.treePath}" on token "${this.path}"`,
        );
      }
    }

    if (!this.#getLocalModes().includes(fromMode)) {
      throw new SDTFError(
        'SDTF_MODE_RENAME_FAILED',
        `Mode "${fromMode}" does not exist in token "${this.path}"`,
      );
    }
    if (this.#getLocalModes().includes(parsedToMode)) {
      throw new SDTFError(
        'SDTF_MODE_RENAME_FAILED',
        `Mode "${parsedToMode}" already exists in token "${this.path}"`,
      );
    }

    const maybeCollection = this.getCollection();
    if (maybeCollection && !maybeCollection.allowedModes.includes(parsedToMode)) {
      throw new SDTFError(
        'SDTF_MODE_RENAME_FAILED',
        `Mode "${parsedToMode}" is not allowed in collection "${
          this.path
        }" defining modes: ${maybeCollection.allowedModes.map(c => `"${c}"`).join(', ')}.`,
      );
    }

    // Rename mode in rawValue
    this.#rawValueParts.renameMode(fromMode, parsedToMode);

    const isResolvableMode = this.#modesResolvabilityMap.get(fromMode);

    if (isResolvableMode === undefined) {
      throw new SDTFError(
        'SDTF_MODE_RENAME_FAILED',
        `Mode "${fromMode}" was not found in the mode resolvablity map but should be in it.`,
      );
    }

    this.#modesResolvabilityMap.delete(fromMode);
    this.#modesResolvabilityMap.set(toMode, isResolvableMode);
    this.#computeSortedModes();

    // Rename reference from this token on the old mode
    this.treeState
      .getAliasReferencesFrom({ treePath: this.path, mode: fromMode })
      .forEach(reference => {
        this.treeState.updateAliasReference(reference.from, {
          ...reference,
          from: {
            ...reference.from,
            mode: parsedToMode,
          },
        });
      });

    // Rename reference to this token
    this.treeState.getAliasReferencesTo({ treePath: this.path }).forEach(reference => {
      const { from, to } = reference;
      if (to.mode === fromMode) {
        this.treeState.updateAliasReference(from, {
          ...reference,
          to: {
            ...to,
            mode: parsedToMode,
          },
        });
      }
    });
  }

  /**
   * Update the whole value of the token (including modes)
   * @param nextValue
   */
  public updateValue(
    nextValue: Partial<PickSpecifyDesignToken<Type, string, false, true>['$value']>,
    { allowModeCreation = true, overrideAliases = true }: UpdateOptions = {
      allowModeCreation: true,
      overrideAliases: true,
    },
  ) {
    const options = { allowModeCreation, overrideAliases };

    if (this.isTopLevelAlias) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        "Can't update a value for a top level alias",
      );
    } else if (matchIsTopLevelAliasSignature(nextValue)) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        "Can't update a value with a top level alias",
      );
    }

    const valueByMode = Object.entries(nextValue);
    const nextModes = Object.keys(nextValue);

    const modesDiff = this.modes.filter(mode => !nextModes.includes(mode));

    for (const mode of modesDiff) {
      this.#deleteRawValuePartsAndAliasesForModeAndValue(_ => true, mode);
      this.#modesResolvabilityMap.delete(mode);
    }

    for (const [mode, nextValue] of valueByMode) {
      this.updateModeValue(mode, nextValue, options);
    }
  }

  #updateTimingFunction(
    {
      mode,
      nextValue,
      prefixPath: prefixPath = ValuePath.empty(),
    }: {
      mode: string;
      // WARNING: The type is not accurate. we're in a case where everything can be aliased but as we handle the case where everything is aliased and we're not looking into the value, it's a shortcut to avoid having a gigantic type
      nextValue: Partial<SpecifyTransitionValue['timingFunction']>;
      prefixPath?: ValuePath;
    },
    options: RequiredUpdateOptions,
  ) {
    if (matchIsModeAndValueLevelAliasSignature(nextValue)) {
      this.#overrideWithAlias({ mode, alias: nextValue, prefixPath }, options);
      return;
    }

    const currentTimingFunction = this.#rawValueParts.getChildren({
      mode,
      valuePath: prefixPath,
    });

    let tokenState: TokenState = this as any;
    let targetMode = mode;
    let isCurrentlyCubicBezier = false;

    if (currentTimingFunction.length > 0) {
      isCurrentlyCubicBezier =
        typeof currentTimingFunction[0].valuePath.at(
          currentTimingFunction[0].valuePath.length - 1,
        ) === 'number';
    } else {
      const aliasRef = this.treeState.getDeepAliasReferencesFrom({
        treePath: this.path,
        mode,
        valuePath: prefixPath,
      });

      if (!aliasRef || !aliasRef.isResolvable) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path "${this.path}.$value.${targetMode}.${prefixPath}" points neither to a value or an alias. It should be one of the two.`,
        );
      }

      // Alias is supposed to be resolvable

      const aliasTokenState = this.treeState.getTokenState(aliasRef.to.treePath)!;

      if (!options?.overrideAliases) {
        tokenState = aliasTokenState;
        targetMode = aliasRef.to.mode!;
      }
      isCurrentlyCubicBezier = Array.isArray(
        aliasTokenState.getJSONValue({
          resolveAliases: true,
          allowUnresolvable: false,
          targetMode: aliasRef.to.mode,
        }),
      );
    }

    if (
      (Array.isArray(nextValue) && isCurrentlyCubicBezier) ||
      (!Array.isArray(nextValue) && !isCurrentlyCubicBezier)
    ) {
      tokenState.#traverseAndUpdate(
        targetMode,
        (tokenState.type === 'transition' ? { timingFunction: nextValue } : nextValue) as JSONValue,
        options,
      );
      return;
    }

    // If the type is switching, we need the whole value to be able to replace
    if (Array.isArray(nextValue)) {
      specifyCubicBezierDefinition.aliasableValueZodSchema.parse(nextValue);
    } else {
      specifyStepsTimingFunctionDefinition.aliasableValueZodSchema.parse(nextValue);
    }

    tokenState.#deleteRawValuePartsAndAliasesForModeAndValue(
      where => prefixPath.isRootOf(where.valuePath),
      targetMode,
      prefixPath,
    );

    tokenState.#traverseAndSetValueFromValuePathForMode(
      targetMode,
      prefixPath,
      nextValue as JSONValue,
    );
  }

  #updateBorderStyle(
    {
      mode,
      nextValue,
      prefixPath: prefixPath = ValuePath.empty(),
    }: {
      mode: string;
      // WARNING: The type is not accurate. we're in a case where everything can be aliased but as we handle the case where everything is aliased and we're not looking into the value, it's a shortcut to avoid having a gigantic type
      nextValue: Partial<SpecifyBorderValue['style']>;
      prefixPath?: ValuePath;
    },
    options: RequiredUpdateOptions,
  ) {
    if (matchIsModeAndValueLevelAliasSignature(nextValue)) {
      this.#overrideWithAlias({ mode, alias: nextValue, prefixPath }, options);
      return;
    }

    const objectBorderStyleParts = this.#rawValueParts.getRawPartsFromPrefix({
      mode,
      prefixPath,
    });

    const stringStylePart = this.#rawValueParts.getRawPart({
      mode,
      valuePath: prefixPath,
    });

    let tokenState: TokenState = this as any;
    let targetMode = mode;
    let isCurrentlyString = false;

    if (stringStylePart || objectBorderStyleParts) {
      isCurrentlyString = !!stringStylePart;
    } else {
      const aliasRef = this.treeState.getDeepAliasReferencesFrom({
        treePath: this.path,
        mode,
        valuePath: prefixPath,
      });

      if (!aliasRef || !aliasRef.isResolvable) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path "${this.path}.$value.${targetMode}.${prefixPath}" points neither to a value or an alias. It should be one of the two.`,
        );
      }

      // Alias is supposed to be resolvable
      if (!options?.overrideAliases) {
        tokenState = this.treeState.getTokenState(aliasRef.to.treePath)!;
        targetMode = aliasRef.to.mode!;

        // We'll update the alias token state so it'll be the root value
        prefixPath.clear();
      }

      isCurrentlyString =
        typeof tokenState.getJSONValue({
          resolveAliases: true,
          allowUnresolvable: false,
          targetMode: aliasRef.to.mode,
        }) === 'string';
    }

    if (
      (typeof nextValue === 'string' && isCurrentlyString) ||
      (!(typeof nextValue === 'string') && !isCurrentlyString)
    ) {
      tokenState.#traverseAndUpdate(
        targetMode,
        createValueToTraverseFromPrefix(prefixPath, nextValue),
        options,
      );
      return;
    }

    borderStyleDefinition.aliasableValueZodSchema.parse(nextValue);

    tokenState.#deleteRawValuePartsAndAliasesForModeAndValue(
      where => prefixPath.isRootOf(where.valuePath),
      targetMode,
      prefixPath,
    );

    tokenState.#traverseAndSetValueFromValuePathForMode(
      targetMode,
      prefixPath,
      nextValue as JSONValue,
    );
  }

  #updateGradient(
    {
      mode,
      nextValue: initialNextValue,
      prefixPath = ValuePath.empty(),
    }: {
      mode: string;
      nextValue: Partial<PickSpecifyDesignToken<'gradient', string, true, false>['$value']>;
      prefixPath?: ValuePath;
    },
    options: RequiredUpdateOptions,
  ) {
    if (matchIsModeAndValueLevelAliasSignature(initialNextValue)) {
      this.#overrideWithAlias({ mode, alias: initialNextValue, prefixPath }, options);
      return;
    }

    // Ts can't narrow down the type correctly, so we have to do it
    const nextValue = initialNextValue as Partial<
      Exclude<
        PickSpecifyDesignToken<'gradient', string, true, false>['$value'],
        SpecifyModeAndValueLevelAliasSignature
      >
    >;

    let pathToTrim = ValuePath.empty();
    let tokenState: TokenState = this as any;
    let targetMode = mode;

    let currentType: SpecifyGradientValue['type'] | undefined = undefined;

    const rawPart = this.#rawValueParts.getRawPart({
      mode,
      valuePath: prefixPath.clone().append('type'),
    });

    if (rawPart) {
      currentType = rawPart.value as SpecifyGradientValue['type'];
    } else {
      const maybeAlias = this.treeState.getDeepAliasReferenceAndPathInfoFrom({
        treePath: this.path,
        mode,
        valuePath: prefixPath,
      });

      if (!maybeAlias) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path "${this.path}.$value.${targetMode}.${prefixPath}" points neither to a value or an alias. It should be one of the two.`,
        );
      }

      const { aliasRef, traversedPath } = maybeAlias;

      if (!aliasRef.isResolvable) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path ${this.path}.$value.${targetMode}.${prefixPath} is pointing to "${aliasRef.to.treePath}.$value.${aliasRef.to.mode}" which an unresolvable alias. Can't perform an update over an unresolvable alias.`,
        );
      }

      const aliasToken = this.treeState.getTokenState(aliasRef.to.treePath)!;
      const aliasTokenValue = aliasToken.getJSONValue({
        resolveAliases: true,
        allowUnresolvable: false,
        targetMode: aliasRef.to.mode,
      }) as SpecifyGradientValue;
      currentType = aliasTokenValue.type;

      if (!options.overrideAliases) {
        tokenState = aliasToken;
        targetMode = aliasRef.to.mode!;
        pathToTrim = traversedPath;
      } else {
        this.#deleteRawValuePartsAndAliasesForModeAndValue(
          where => prefixPath.isRootOf(where.valuePath),
          mode,
          prefixPath,
        );
        this.#traverseAndSetValueFromValuePathForMode(mode, prefixPath, aliasTokenValue);
      }
    }

    nextValue.type ??= currentType;

    const schema =
      specifyGradientDefinition.aliasableValueZodSchema._def.options[0]._def.optionsMap.get(
        nextValue.type,
      );

    if (!schema) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Couldn't find a valid schema for a gradient of type: ${nextValue.type}`,
      );
    }

    if (nextValue.type === currentType) {
      schema.passthrough().omit({ colorStops: true }).partial().parse(nextValue);

      if (nextValue.colorStops)
        specifyGradientPartialAlisableValueColorStops.parse(nextValue.colorStops);
    } else {
      schema.strict().parse(nextValue);
    }

    if (nextValue.type === currentType) {
      if (nextValue.colorStops) {
        // @ts-expect-error - Color is supposed to be in the object, but we handle the update separately
        nextValue.colorStops = nextValue.colorStops.map((stop, i) => {
          if (!stop.color) return stop;

          const { color, ...rest } = stop;

          tokenState.#updateColor(
            {
              mode: targetMode,
              nextValue: stop.color as any,
              prefixPath: prefixPath
                .clone()
                .concat(['colorStops', i, 'color'])
                .trimStartWith(pathToTrim),
            },
            options,
          );

          return rest;
        });
      }

      tokenState.#traverseAndUpdate(
        targetMode,
        // When we override the aliases, tokenState will be this, so nothing more to do
        // If we don't override them, tokenState may be something else than this, we need to trim the path that we already went through
        options.overrideAliases
          ? createValueToTraverseFromPrefix(prefixPath, nextValue)
          : createValueToTraverseFromPrefix(
              prefixPath.clone().trimStartWith(pathToTrim),
              nextValue,
            ),
        options,
      );
    } else {
      tokenState.#rawValueParts.deleteMode(targetMode);
      const aliases = this.treeState.getAliasReferencesFrom({
        treePath: tokenState.path,
        mode: targetMode,
      });

      for (const alias of aliases) {
        tokenState.treeState.deleteOneAliasReference(alias.from);
      }

      const finalPath = options.overrideAliases
        ? prefixPath
        : prefixPath.clone().trimStartWith(pathToTrim);

      tokenState.#traverseAndSetValueFromValuePathForMode(targetMode, finalPath, nextValue);
    }
  }

  #updateColor(
    {
      mode,
      nextValue: initialNextValue,
      prefixPath = ValuePath.empty(),
    }: {
      mode: string;
      nextValue: Partial<PickSpecifyDesignToken<'color', string, true, false>['$value']>;
      prefixPath?: ValuePath;
    },
    options: RequiredUpdateOptions,
  ) {
    if (matchIsModeAndValueLevelAliasSignature(initialNextValue)) {
      this.#overrideWithAlias({ mode, alias: initialNextValue, prefixPath }, options);
      return;
    }
    // Ts can't narrow down the type correctly, so we do it
    const nextValue = initialNextValue as Partial<
      Exclude<
        PickSpecifyDesignToken<'color', string, true, false>['$value'],
        SpecifyModeAndValueLevelAliasSignature
      >
    >;

    if (nextValue === null && this.type !== 'textStyle') {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Tried to set 'null' for the color of a ${this.type} token at path "${
          this.path
        }.$value.${mode}${
          prefixPath ? `.${prefixPath}` : ''
        }", but only the color of a text style is nullable`,
      );
    }

    if (nextValue === null) {
      if (!prefixPath || prefixPath.length !== 1 || prefixPath.at(0) !== 'color') {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `Tried to set 'null' for the color of a ${this.type} token at path "${
            this.path
          }.$value.${mode}${
            prefixPath ? `.${prefixPath}` : ''
          }", but only the color of a text style is nullable`,
        );
      }

      this.#traverseAndSetValueFromValuePathForMode(mode, ValuePath.empty(), { color: null });
      return;
    }

    let pathToTrim = ValuePath.empty();

    let tokenState: TokenState = this as any;
    let targetMode = mode;

    const currentModel: SpecifyColorValue['model'] | undefined = (() => {
      const rawPart = this.#rawValueParts.getRawPart({
        mode,
        valuePath: prefixPath.clone().append('model'),
      });

      if (rawPart) {
        return rawPart.value as SpecifyColorValue['model'];
      } else {
        const colorRawPart = this.#rawValueParts.getRawPart({
          mode,
          valuePath: prefixPath,
        });

        if (colorRawPart && colorRawPart.value === null) return undefined;

        const maybeAlias = this.treeState.getDeepAliasReferenceAndPathInfoFrom({
          treePath: this.path,
          mode,
          valuePath: prefixPath,
        });

        if (!maybeAlias) {
          throw new SDTFError(
            'SDTF_VALUE_UPDATE_FAILED',
            `The path "${this.path}.$value.${targetMode}.${prefixPath}" points neither to a value or an alias. It should be one of the two.`,
          );
        }

        const { aliasRef, traversedPath } = maybeAlias;

        if (!aliasRef.isResolvable) {
          throw new SDTFError(
            'SDTF_VALUE_UPDATE_FAILED',
            `The path ${this.path}.$value.${targetMode}.${prefixPath} is pointing to "${aliasRef.to.treePath}.$value.${aliasRef.to.mode}" which an unresolvable alias. Can't perform an update over an unresolvable alias.`,
          );
        }

        const aliasToken = this.treeState.getTokenState(aliasRef.to.treePath)!;
        const aliasTokenValue = aliasToken.getJSONValue({
          resolveAliases: true,
          allowUnresolvable: false,
          targetMode: aliasRef.to.mode,
        }) as SpecifyColorValue;

        if (!options.overrideAliases) {
          tokenState = aliasToken;
          targetMode = aliasRef.to.mode!;
          pathToTrim = traversedPath;
        } else {
          this.#deleteRawValuePartsAndAliasesForModeAndValue(
            where => prefixPath.isRootOf(where.valuePath),
            mode,
            prefixPath,
          );
          this.#traverseAndSetValueFromValuePathForMode(mode, prefixPath, aliasTokenValue);
        }

        return aliasTokenValue.model;
      }
    })();

    if (!nextValue.model && !currentModel) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `At least one color model should be defined when updating the color. Couldn't find one in the either the update value "${JSON.stringify(
          nextValue,
        )}" or the token at "${this.path}"`,
      );
    }

    nextValue.model ??= currentModel;

    const schema =
      specifyColorDefinition.aliasableValueZodSchema._def.options[0]._def.optionsMap.get(
        nextValue.model,
      );

    if (!schema) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Couldn't find a valid schema for a color with model: ${nextValue.model}`,
      );
    }

    if (nextValue.model === currentModel) {
      schema.partial().strict().parse(nextValue);

      tokenState.#traverseAndUpdate(
        targetMode,
        // When we override the aliases, tokenState will be this, so nothing more to do
        // If we don't override them, tokenState may be something else than this, we need to trim the path that we already went through
        options.overrideAliases
          ? createValueToTraverseFromPrefix(prefixPath, nextValue)
          : createValueToTraverseFromPrefix(
              prefixPath.clone().trimStartWith(pathToTrim),
              nextValue,
            ),
        options,
      );
    } else {
      schema.passthrough().omit({ alpha: true }).parse(nextValue);

      const finalPath = options.overrideAliases
        ? prefixPath
        : prefixPath.clone().trimStartWith(pathToTrim);

      tokenState.#deleteRawValuePartsAndAliasesForModeAndValue(
        where =>
          finalPath.isRootOf(where.valuePath) &&
          where.valuePath.at(where.valuePath.length - 1) !== 'alpha',
        targetMode,
      );

      tokenState.#traverseAndSetValueFromValuePathForMode(targetMode, finalPath, nextValue);
    }
  }

  /**
   * This function will delete `rawValueParts` and `AliasReferences` for a given mode, but if you return `false` in the callback, the value or alias won't be deleted
   */
  #deleteRawValuePartsAndAliasesForModeAndValue(
    fn: (where: { mode: string; valuePath: ValuePath }) => boolean,
    mode: string,
    valuePath?: ValuePath,
  ) {
    this.#rawValueParts.filterDelete(part => (mode === part.mode ? fn(part) : false));
    const aliases = this.treeState.getAliasReferencesFrom({ treePath: this.path, mode, valuePath });

    for (const alias of aliases) {
      // ignore top level alias and non-matching modes
      if (alias.from.mode === null || alias.from.mode !== mode) continue;
      if (!fn(alias.from as { mode: string; valuePath: ValuePath })) continue;

      this.treeState.deleteOneAliasReference(alias.from);
    }
  }

  #overrideWithAlias(
    {
      mode,
      alias,
      prefixPath = ValuePath.empty(),
    }: {
      mode: string;
      alias: SpecifyModeAndValueLevelAliasSignature;
      prefixPath?: ValuePath;
    },
    options: RequiredUpdateOptions,
  ) {
    const aliasRef = this.treeState.getDeepAliasReferencesFrom({
      mode,
      treePath: this.path,
      valuePath: prefixPath,
    });

    if (options.overrideAliases || !aliasRef) {
      this.#rawValueParts.filterDelete(
        part => part.mode === mode && prefixPath.isRootOf(part.valuePath),
      );
      const aliases = this.treeState.getAliasReferencesFrom({ treePath: this.path, mode });

      for (const alias of aliases) {
        if (alias.from.mode === null || alias.from.mode !== mode) continue;

        if (!prefixPath.isRootOf(alias.from.valuePath)) continue;

        this.treeState.deleteOneAliasReference(alias.from);
      }

      this.#traverseAndSetValueFromValuePathForMode(mode, prefixPath, alias);
    } else if (aliasRef) {
      if (!aliasRef.isResolvable) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path ${this.path}.$value.${mode}.${prefixPath} is pointing to "${aliasRef.to.treePath}.$value.${aliasRef.to.mode}" which an unresolvable alias. Can't perform an update over an unresolvable alias.`,
        );
      }

      // Check is done above
      const tokenState = this.treeState.getTokenState(aliasRef.to.treePath)!;

      tokenState.#overrideWithAlias({ mode: aliasRef.to.mode!, alias }, options);
    } else {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `The path "${this.path}.$value.${mode}.${prefixPath}" points neither to a value or an alias. It should be one of the two.`,
      );
    }
  }

  #traverseAndUpdate(
    mode: string,
    nextValue: Partial<PickSpecifyDesignToken<Type, string, true, false>['$value']>,
    options: RequiredUpdateOptions,
  ) {
    traverseJSONValue(nextValue as JSONValue, (nextValue, valuePath) => {
      if (typeof nextValue === 'object' && nextValue !== null) {
        if (matchIsModeAndValueLevelAliasSignature(nextValue)) {
          this.#updateAliasAtPath(
            {
              targetMode: mode,
              valuePath: new ValuePath(valuePath),
              nextValue: nextValue,
            },
            options,
          );

          return false;
        }

        return;
      }

      this.#updateValueAtPath(
        { targetMode: mode, valuePath: new ValuePath(valuePath), nextValue },
        options,
      );
    });
  }

  #replaceModeLevelAliasByRawValue(mode: string) {
    const modeValueAliases = this.treeState.getAliasReferencesFrom({
      treePath: this.path,
      mode,
      valuePath: ValuePath.empty(),
    });

    if (modeValueAliases.length === 0) return;

    const nextValue = this.getJSONValue({
      resolveAliases: true,
      allowUnresolvable: false,
      targetMode: mode as Mode,
    });

    this.treeState.deleteOneAliasReference(modeValueAliases[0].from);

    this.#traverseAndSetValueFromValuePathForMode(mode, ValuePath.empty(), nextValue);
  }

  updateModeValue(
    mode: string,
    nextValue: Partial<PickSpecifyDesignToken<Type, string, true, false>['$value']>,
    { overrideAliases = true, allowModeCreation = false }: UpdateOptions = {
      overrideAliases: true,
      allowModeCreation: false,
    },
  ) {
    const options = { overrideAliases, allowModeCreation };

    if (!allowModeCreation && !this.modes.includes(mode)) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        `Mode "${mode}" does not exist in token "${this.path.toString()}"`,
      );
    }

    if (this.isTopLevelAlias) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        "Can't update a value for a top level alias",
      );
    }

    // Handle mode level alias
    if (matchIsModeAndValueLevelAliasSignature(nextValue)) {
      this.#rawValueParts.deleteMode(mode);
      this.treeState.deleteAliasReferencesFrom({ treePath: this.path, mode });

      const targetTreePath = TreePath.fromString(nextValue.$alias);

      const targetTokenState = this.treeState.getTokenState(targetTreePath);

      const isResolvable = !!targetTokenState && targetTokenState.modes.includes(nextValue.$mode);

      const from = {
        treePath: this.path,
        mode,
        valuePath: ValuePath.empty(),
      };

      const to = {
        treePath: targetTokenState?.path ?? targetTreePath,
        mode: nextValue.$mode,
      };

      this.treeState.addAliasReference(
        isResolvable
          ? {
              from,
              to,
              isResolvable: true,
            }
          : {
              from,
              to,
              isResolvable: false,
              reason: `Token at path "${targetTreePath}" with mode "${nextValue.$mode}" does not exist`,
            },
      );

      this.validateValue();
      return;
    }

    if (!this.modes.includes(mode)) {
      this.#definition.aliasableValueZodSchema.parse(nextValue);

      this.#traverseAndSetValueFromValuePathForMode(
        mode,
        ValuePath.empty(),
        nextValue as JSONValue,
      );

      this.validateValue();

      return;
    }

    if (options.overrideAliases) {
      this.#replaceModeLevelAliasByRawValue(mode);
    }

    switch (this.type) {
      case 'color': {
        this.#updateColor({ mode, nextValue: nextValue as any }, options as RequiredUpdateOptions);
        break;
      }
      case 'border': {
        if (!nextValue || typeof nextValue !== 'object') {
          this.#traverseAndUpdate(mode, nextValue, options);
          break;
        }

        // The type is accurate in input, so we abuse the type system here
        const { color, style, ...rest } = nextValue as any;

        if (style)
          this.#updateBorderStyle(
            { mode, nextValue: style as any, prefixPath: new ValuePath(['style']) },
            options as RequiredUpdateOptions,
          );
        if (color)
          this.#updateColor(
            { mode, nextValue: color as any, prefixPath: new ValuePath(['color']) },
            options as RequiredUpdateOptions,
          );

        this.#traverseAndUpdate(
          mode,
          rest as Partial<PickSpecifyDesignToken<Type, string, true, false>['$value']>,
          options,
        );

        break;
      }
      case 'shadow':
      case 'textStyle': {
        if (!nextValue || !('color' in nextValue) || typeof nextValue !== 'object') {
          this.#traverseAndUpdate(mode, nextValue, options);
          break;
        }

        const { color, ...rest } = nextValue;

        this.#updateColor(
          { mode, nextValue: color as any, prefixPath: new ValuePath(['color']) },
          options as RequiredUpdateOptions,
        );

        this.#traverseAndUpdate(
          mode,
          rest as Partial<PickSpecifyDesignToken<Type, string, true, false>['$value']>,
          options,
        );

        break;
      }
      case 'gradient': {
        this.#updateGradient({ mode, nextValue }, options as RequiredUpdateOptions);
        break;
      }
      case 'gradients': {
        (
          nextValue as Partial<
            Exclude<
              PickSpecifyDesignToken<'gradients', string, true, false>['$value'],
              { $alias: string; $mode: string }
            >
          >
        ).map((gradient, i) => {
          this.#updateGradient(
            {
              mode,
              nextValue: gradient as Partial<
                PickSpecifyDesignToken<Type, string, true, false>['$value']
              >,
              prefixPath: new ValuePath([i]),
            },
            options as RequiredUpdateOptions,
          );
        });
        break;
      }
      case 'shadows': {
        const filteredNextValue = (
          nextValue as Partial<
            Exclude<
              PickSpecifyDesignToken<'shadows', string, true, false>['$value'],
              { $alias: string; $mode: string }
            >
          >
        ).map((shadow, i) => {
          if (!shadow || matchIsModeAndValueLevelAliasSignature(shadow)) return shadow;

          const { color, ...rest } = shadow;

          if (color && !matchIsModeAndValueLevelAliasSignature(color))
            this.#updateColor(
              { mode, nextValue: color as any, prefixPath: new ValuePath([i, 'color']) },
              options as RequiredUpdateOptions,
            );

          return rest;
        });

        this.#traverseAndUpdate(
          mode,
          filteredNextValue as Partial<PickSpecifyDesignToken<Type, string, true, false>['$value']>,
          options,
        );
        break;
      }
      case 'transition': {
        if (!nextValue || !('timingFunction' in nextValue) || typeof nextValue !== 'object') {
          this.#traverseAndUpdate(mode, nextValue, options);
          break;
        }

        // Narrowing with alias is complicated, so as everything is checked above, let's take a shortcut
        const { timingFunction, ...rest } = nextValue as any;

        this.#updateTimingFunction(
          { mode, nextValue: timingFunction, prefixPath: new ValuePath(['timingFunction']) },
          options as RequiredUpdateOptions,
        );

        this.#traverseAndUpdate(mode, rest, options);
        break;
      }
      default: {
        this.#traverseAndUpdate(mode, nextValue, options);
        break;
      }
    }

    this.validateValue();
  }

  #updateAliasAtPath(
    {
      targetMode,
      valuePath,
      nextValue,
    }: {
      targetMode: string;
      valuePath: ValuePath;
      nextValue: SpecifyModeAndValueLevelAliasSignature;
    },
    { overrideAliases }: RequiredUpdateOptions,
  ) {
    const toTreePath = TreePath.fromString(nextValue.$alias);

    const toTokenState = this.treeState.getTokenState(toTreePath);

    const isResolvable = !!toTokenState && toTokenState.modes.includes(nextValue.$mode);

    const from = { mode: targetMode, treePath: this.path, valuePath };

    if (!overrideAliases) {
      const aliasReference = this.treeState.getDeepAliasReferencesFrom({
        treePath: this.path,
        valuePath,
        mode: targetMode,
      });

      if (aliasReference) {
        // We're working at least at mode level, so the mode is always here
        from.mode = aliasReference.to.mode!;
        from.treePath = aliasReference.to.treePath;
        from.valuePath = ValuePath.empty();
      }
    }

    const to = { mode: nextValue.$mode, treePath: toTokenState?.path ?? toTreePath };

    this.treeState.upsertAliasReference(
      isResolvable
        ? {
            from,
            to,
            isResolvable: true,
          }
        : {
            from,
            to,
            isResolvable: false,
            reason: `Couldn't find a token at path "${nextValue.$alias}" with mode "${nextValue.$mode}"`,
          },
    );

    const valuePartWhere = { mode: targetMode, valuePath };
    if (this.#rawValueParts.has(valuePartWhere)) {
      this.#rawValueParts.delete(valuePartWhere);
      return;
    }

    const parent = this.#rawValueParts.getParent(valuePartWhere);

    if (parent && parent.value === null) {
      this.#rawValueParts.delete(parent);
      return;
    }

    const children = this.#rawValueParts.getChildren(valuePartWhere);

    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        this.#rawValueParts.delete(children[i]);
      }
      return;
    }
  }

  #updateValueAtPath(
    {
      targetMode,
      valuePath,
      nextValue,
    }: {
      targetMode: string;
      valuePath: ValuePath;
      nextValue: unknown;
    },
    { overrideAliases }: RequiredUpdateOptions,
  ) {
    const valuePartWhere = { mode: targetMode, valuePath };

    if (this.#rawValueParts.has(valuePartWhere)) {
      this.#rawValueParts.update(valuePartWhere, {
        mode: targetMode,
        valuePath,
        value: nextValue as JSONValue,
      });
      return;
    } else if (this.#rawValueParts.hasParent(valuePartWhere)) {
      // Because we set a value by its primitives, we need to check if there's a parent
      // That may be null and we remove it if we find it
      const part = this.#rawValueParts.getParent(valuePartWhere)!;

      if (part && part.value === null) this.#rawValueParts.delete(part);

      this.#rawValueParts.add({
        mode: targetMode,
        valuePath,
        value: nextValue as JSONValue,
      });

      return;
    } else if (this.#rawValueParts.hasChildren(valuePartWhere)) {
      // Because we set the value by primitive, setting a value by a parent is only in the nullable case
      if (nextValue !== null) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The next value for ${
            this.path
          }.${targetMode}.${valuePath} can't be something else than null. Found: ${JSON.stringify(
            nextValue,
          )}`,
        );
      }

      const children = this.#rawValueParts.getChildren(valuePartWhere);

      children.forEach(part => this.#rawValueParts.delete(part));

      this.#rawValueParts.add({ mode: targetMode, valuePath, value: null });

      return;
    }

    if (overrideAliases) {
      const aliasRef = this.treeState.getAliasReferenceOrParentFrom({
        treePath: this.path,
        valuePath,
        mode: targetMode,
      });

      if (!aliasRef) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path "${this.path}.$value.${targetMode}.${valuePath}" points neither to a value or an alias. It should be one of the two.`,
        );
      }

      if (!aliasRef.isResolvable) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path ${this.path}.$value.${targetMode}.${valuePath} is pointing to "${aliasRef.to.treePath}.$value.${aliasRef.to.mode}" which an unresolvable alias. Can't perform an update over an unresolvable alias.`,
        );
      }

      const tokenState = this.treeState.getTokenState(aliasRef.to.treePath);

      if (!tokenState) {
        throw new SDTFError(
          'SDTF_VALUE_UPDATE_FAILED',
          `The path "${aliasRef.to.treePath}.$value.${aliasRef.to.mode}" is supposed to point to valid token, so this error should not happen. Please contact us if it does`,
        );
      }

      const jsonValue = tokenState.getJSONValue({
        resolveAliases: true,
        allowUnresolvable: false,
        targetMode: aliasRef.to.mode,
      });

      this.#traverseAndSetValueFromValuePathForMode(targetMode, aliasRef.from.valuePath, jsonValue);

      this.treeState.deleteOneAliasReference({
        treePath: this.path,
        valuePath: aliasRef.from.valuePath,
        mode: targetMode,
      });

      this.#rawValueParts.upsert(valuePartWhere, {
        mode: targetMode,
        valuePath,
        value: nextValue as JSONValue,
      });

      return;
    }

    const maybeReference = this.treeState.getDeepAliasReferenceAndPathInfoFrom({
      valuePath,
      mode: targetMode,
      treePath: this.path,
    });

    if (!maybeReference) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `The path "${this.path}.$value.${targetMode}.${valuePath}" points neither to a value or an alias. It should be one of the two.`,
      );
    }

    const { aliasRef, toValuePath: targetPath } = maybeReference;

    if (!aliasRef.isResolvable || !aliasRef.to.mode) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `The path ${this.path}.$value.${targetMode}.${valuePath} is pointing to "${aliasRef.to.treePath}.$value.${aliasRef.to.mode}" which an unresolvable alias. Can't perform an update over an unresolvable alias.`,
      );
    }

    const tokenState = this.treeState.getTokenState(aliasRef.to.treePath);

    if (!tokenState) return;

    tokenState.#rawValueParts.upsert(
      { mode: aliasRef.to.mode, valuePath: targetPath },
      { mode: aliasRef.to.mode, valuePath: targetPath, value: nextValue as JSONValue },
    );

    tokenState.validateValue();
  }

  /**
   * Will traverse the `nextValue` and use `fromValuePath` as a prefix to know where to set the values
   */
  #traverseAndSetValueFromValuePathForMode(
    mode: string,
    fromValuePath: ValuePath,
    nextValue: JSONValue,
  ) {
    traverseJSONValue(nextValue, (value, suffixPath) => {
      const valuePath = fromValuePath.clone().concat(suffixPath);

      if (typeof value === 'object' && value !== null) {
        if (!matchIsModeAndValueLevelAliasSignature(value)) return;

        const toTreePath = TreePath.fromString(value.$alias);

        const toTokenState = this.treeState.getTokenState(toTreePath);

        const isResolvable = !!toTokenState && toTokenState.modes.includes(value.$mode);

        this.treeState.addAliasReference(
          isResolvable
            ? {
                from: {
                  treePath: this.path,
                  mode,
                  valuePath,
                },
                to: {
                  treePath: toTokenState?.path ?? toTreePath,
                  mode: value.$mode,
                },
                isResolvable: true,
              }
            : {
                from: {
                  treePath: this.path,
                  mode,
                  valuePath,
                },
                to: {
                  treePath: toTokenState?.path ?? toTreePath,
                  mode: value.$mode,
                },
                isResolvable: false,
                reason: `The token at path "${value.$alias}" with mode "${value.$mode}" does not exist`,
              },
        );

        return false;
      }

      this.#rawValueParts.upsert({ mode, valuePath }, { mode, valuePath, value });
    });
  }

  /**
   * Resolve the aliases from the token
   */
  public resolveValueAliases() {
    if (this.#isTopLevelAlias) {
      const statefulAliasResult = this.treeState.getStatefulAliasReference({
        treePath: this.path,
        valuePath: ValuePath.empty(),
        mode: null,
      });

      if (statefulAliasResult.status === 'resolved') {
        this.updateValue(
          statefulAliasResult.tokenState.#resolveValue(null) as PickSpecifyDesignToken<
            Type,
            string,
            false,
            true
          >['$value'],
        );
      }
    } else {
      this.updateValue(
        this.#resolveValue(null) as PickSpecifyDesignToken<Type, string, false, true>['$value'],
      );
    }
  }

  /**
   * Create a new mode for the token
   * @param mode
   * @param nextValue
   */
  public createModeValue(
    mode: string,
    nextValue: PickSpecifyDesignToken<Type, string, true, false>['$value'],
  ) {
    if (this.#isTopLevelAlias) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Cannot create a mode on a top level alias: "${this.path}"`,
      );
    }
    if (this.#getLocalModes().includes(mode)) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Mode "${mode}" already exists in token "${this.path}"`,
      );
    }
    const maybeCollection = this.getCollection();
    if (maybeCollection) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Cannot create mode "${mode}" on token "${
          this.path
        }" that belongs to collection "${maybeCollection.path.toString()}" where modes are: ${maybeCollection.allowedModes
          .map(c => `"${c}"`)
          .join(', ')}`,
      );
    }

    this.updateModeValue(mode, nextValue, { allowModeCreation: true });
  }

  /**
   * Delete a mode of the token
   * @param mode
   */
  public deleteModeValue(mode: string) {
    if (this.#isTopLevelAlias) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Cannot delete a mode on a top level alias: "${this.path}"`,
      );
    }
    if (!this.#getLocalModes().includes(mode)) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Mode "${mode}" does not exist in token "${this.path}"`,
      );
    }

    if (this.#getLocalModes().length === 1) {
      throw new SDTFError(
        'SDTF_VALUE_UPDATE_FAILED',
        `Cannot delete the last mode of a token: "${this.path}"`,
      );
    }

    const maybeCollection = this.getCollection();
    if (maybeCollection && maybeCollection.allowedModes.includes(mode)) {
      // The only state where a token can have a mode that is not in `allowedModes`
      // is when we are deleting a mode from a collection
      throw new SDTFError(
        'SDTF_MODE_DELETE_FAILED',
        `Cannot delete mode "${mode}" on token "${this.path.toString()}" that belongs to collection "${maybeCollection.path.toString()}" where modes are: ${maybeCollection.allowedModes
          .map(c => `"${c}"`)
          .join(', ')}`,
      );
    }

    this.#deleteRawValuePartsAndAliasesForModeAndValue(_ => true, mode);
    this.#modesResolvabilityMap.delete(mode);
    this.#computeSortedModes();
  }

  /**
   * Get the JSON representation of the Token value
   * @param options - resolveAliases, allowUnresolvable, targetMode allows for more control over the returned value
   */
  public getJSONValue<
    ResolveAliases extends boolean,
    AllowUnresolvable extends boolean = true,
    TargetMode extends Mode | null = null,
  >(
    options?: GetJSONTokenValueOptions<ResolveAliases, AllowUnresolvable, TargetMode>,
  ): PickSpecifyDesignToken<
    Type,
    Mode,
    AllowUnresolvable extends true ? true : false,
    TargetMode extends string ? false : true
  >['$value'] {
    const { resolveAliases, targetMode, allowUnresolvable } =
      mergeGetJSONTokenValueOptions(options);

    if (resolveAliases) {
      if (allowUnresolvable === false && this.#isFullyResolvable === false) {
        throw new SDTFError(
          'SDTF_HAS_UNRESOLVABLE_ALIASES',
          `Token "${this.path.toString()}" has unresolvable references: ${this.treeState
            .getAliasReferencesFrom({ treePath: this.path }, { isResolvable: false })
            .map(r => `"${r.to.treePath}"`)
            .join(',')}.`,
        );
      }
      if (targetMode !== null && !this.modes.includes(targetMode as Mode)) {
        throw new SDTFError(
          'SDTF_MODE_DOES_NOT_EXIST',
          `Mode "${targetMode}" does not exist on token "${this.path.toString()}".`,
        );
      }
      return this.#resolveValue(targetMode) as PickSpecifyDesignToken<
        Type,
        Mode,
        AllowUnresolvable extends true ? true : false,
        TargetMode extends string ? false : true
      >['$value'];
    }
    return this.value as PickSpecifyDesignToken<
      Type,
      Mode,
      AllowUnresolvable extends true ? true : false,
      TargetMode extends string ? false : true
    >['$value'];
  }

  /**
   * Get the JSON representation of the Token
   * @param options - resolveAliases, allowUnresolvable, targetMode allows for more control over the returned value
   */
  public getJSONToken<
    ResolveAliases extends boolean,
    AllowUnresolvable extends boolean = true,
    TargetMode extends Mode | null = null,
  >(options?: GetJSONTokenValueOptions<ResolveAliases, AllowUnresolvable, TargetMode>) {
    return {
      $type: this.#type,
      $value: this.getJSONValue(options),
      ...super.getCommonJSON(),
    } as PickSpecifyDesignToken<
      Type,
      Mode,
      AllowUnresolvable extends true ? true : false,
      TargetMode extends string ? false : true
    >;
  }

  /**
   * Get serializable JSON representation of the Token
   * @internal
   */
  public getJSONProperties() {
    return this.getJSONToken({ resolveAliases: false });
  }
  /**
   * Get serializable JSON representation of the Token
   * @internal
   */
  public toJSON() {
    return this.getJSONToken({ resolveAliases: false });
  }

  /**
   * Moves the item to the specified path.
   *
   * @param {Array<string>} toPath - The path to move the item to.
   */
  public move(toPath: TreePath) {
    const isMovingToRootLevel = toPath.length === 0;

    let toPathMaybeGroupState = undefined;
    let toPathMaybeCollectionState = undefined;
    let toPathParentCollectionState = undefined;

    if (!isMovingToRootLevel) {
      // We check if the target path is a collection
      const maybeCollectionState = this.treeState.getCollectionState(toPath);
      if (maybeCollectionState) {
        toPathMaybeCollectionState = maybeCollectionState;
      } else {
        // If `toPath` is not a collection, we can check if `toPath` is a group...
        toPathMaybeGroupState = this.treeState.getGroupState(toPath);
        // and holds a parent collection
        toPathParentCollectionState = this.treeState.getNearestCollectionState(toPath);
      }
    }

    if (!isMovingToRootLevel && !toPathMaybeGroupState && !toPathMaybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Node "${toPath}" does not exist.`);
    }

    if (toPathParentCollectionState || toPathMaybeCollectionState) {
      const comparisonMaybeCollectionState =
        toPathMaybeCollectionState || toPathParentCollectionState;
      if (
        comparisonMaybeCollectionState &&
        !matchHasIdenticalModes(comparisonMaybeCollectionState.allowedModes, this.modes)
      ) {
        if (this.#isTopLevelAlias && !this.#isFullyResolvable) {
          throw new SDTFError(
            'SDTF_TOKEN_MODE_MISMATCH',
            `Modes of token "${this.path.toString()}" cannot be computed since it points to an unresolvable token but is used in the collection "${comparisonMaybeCollectionState.path.toString()}" defining modes "${comparisonMaybeCollectionState.allowedModes.join(
              ',',
            )}"`,
          );
        }
        throw new SDTFError(
          'SDTF_TOKEN_MODE_MISMATCH',
          `Token "${this.path.toString()}" has modes "${this.modes.join(
            ',',
          )}" but is used in the collection "${comparisonMaybeCollectionState.path.toString()}" defining modes "${comparisonMaybeCollectionState.allowedModes.join(
            ',',
          )}"`,
        );
      }
    }

    const pathWithName = toPath.clone().append(this.name);

    this.treeState.getAliasReferencesTo({ treePath: this.path }).forEach(reference => {
      const { from, to } = reference;
      this.treeState.updateAliasReference(from, {
        ...reference,
        to: {
          ...to,
          treePath: pathWithName.clone(),
        },
      });
    });

    this.treeState.getAliasReferencesFrom({ treePath: this.path }).forEach(reference => {
      const { from } = reference;
      this.treeState.updateAliasReference(from, {
        ...reference,
        from: {
          ...from,
          treePath: pathWithName.clone(),
        },
      });
    });

    if (this.path.toString() !== pathWithName.toString()) {
      this.setPath(pathWithName);
    }

    this.treeState.refreshViews();
  }

  matchByType<Return>(
    matcher: {
      [K in SpecifyDesignTokenTypeName]?: (token: TokenState<K, Value, Mode>) => Return;
    },
    missingFn: (token: TokenState) => Return,
  ): Return {
    const matcherFn = matcher[this.type];

    if (!matcherFn) {
      return missingFn(this as any);
    }

    return matcherFn(this as any);
  }

  matchJSONValueByType<MatchReturn, MissingReturn = undefined>(
    matcher: {
      [K in Type]?: (
        token: PickSpecifyDesignToken<K, string, false, false>['$value'],
        mode: string,
      ) => MatchReturn;
    },
    missingFn: (token: TokenState) => MissingReturn,
  ): { [mode: string]: MatchReturn } | MissingReturn | undefined {
    const matcherFn = matcher[this.type];

    if (!matcherFn) {
      return missingFn(this as any);
    }

    let isEmpty = true;
    const matchReturn = this.modes.reduce(
      (acc, mode) => {
        const result = matcherFn(
          this.getJSONValue({
            resolveAliases: true,
            allowUnresolvable: false,
            targetMode: mode as Mode,
          }),
          mode,
        );
        if (!result) return acc;

        isEmpty = false;
        acc[mode] = result;

        return acc;
      },
      {} as { [mode: string]: MatchReturn },
    );

    return isEmpty ? undefined : matchReturn;
  }

  public toTokenStateParams(): TokenStateParams {
    return {
      path: this.path.clone(),
      name: this.name,
      $description: this.description,
      $extensions: deepClone(this.extensions),
      $type: this.type,
      definition: this.definition as any,
      isTopLevelAlias: this.isTopLevelAlias,
      analyzedValuePrimitiveParts: this.#rawValueParts.toAnalyzedValuePrimitiveParts(),
      isFullyResolvable: this.#isFullyResolvable,
      modesResolvabilityMap: new Map(this.#modesResolvabilityMap),
    };
  }

  public toAnalyzedToken(): AnalyzedToken {
    return {
      path: this.path.clone(),
      name: this.name,
      $type: this.type,
      $value: null as any, // We don't need the value anymore
      $description: this.description,
      $extensions: deepClone(this.extensions),
      definition: this.definition as any,
      isTopLevelAlias: this.isTopLevelAlias,
      modes: this.isTopLevelAlias ? null : this.modes,
      analyzedValuePrimitiveParts: this.#rawValueParts.toAnalyzedValuePrimitiveParts(),
      analyzedValueAliasParts: this.treeState
        .getAliasReferencesFrom({
          treePath: this.path,
        })
        .map(aliasReference => {
          if (aliasReference.to.mode === null) {
            const part: AnalyzedTokenValueAliasPart = {
              type: 'topLevelAlias',
              isResolvable: aliasReference.isResolvable,
              alias: {
                path: aliasReference.to.treePath,
              },
            };
            return part;
          } else if (
            aliasReference.from.valuePath.length === 0 &&
            aliasReference.from.mode !== null
          ) {
            const part: AnalyzedTokenValueAliasPart = {
              type: 'modeLevelAlias',
              isResolvable: aliasReference.isResolvable,
              localMode: aliasReference.from.mode,
              alias: {
                path: aliasReference.to.treePath,
                targetMode: aliasReference.to.mode,
              },
            };
            return part;
          } else {
            const part: AnalyzedTokenValueAliasPart = {
              type: 'valueLevelAlias',
              isResolvable: aliasReference.isResolvable,
              localMode: aliasReference.from.mode as string,
              valuePath: aliasReference.from.valuePath,
              alias: {
                path: aliasReference.to.treePath,
                targetMode: aliasReference.to.mode,
              },
            };
            return part;
          }
        }),
      computedModes: this.isTopLevelAlias ? this.modes : [],
      modesResolvability: this.modesResolvability,
      isFullyResolvable: this.#isFullyResolvable,
    };
  }

  /* ------------------------------------------
     Token Type Matchers
  --------------------------------------------- */
  /* v8 ignore start */
  isString(): this is TokenState<'string'> {
    return this.type === designTokenTypeNames.specifyJSONStringTypeName;
  }
  isNumber(): this is TokenState<'number'> {
    return this.type === designTokenTypeNames.specifyJSONNumberTypeName;
  }
  isBoolean(): this is TokenState<'boolean'> {
    return this.type === designTokenTypeNames.specifyJSONBooleanTypeName;
  }
  isNull(): this is TokenState<'null'> {
    return this.type === designTokenTypeNames.specifyJSONNullTypeName;
  }
  isArray(): this is TokenState<'array'> {
    return this.type === designTokenTypeNames.specifyJSONArrayTypeName;
  }
  isObject(): this is TokenState<'object'> {
    return this.type === designTokenTypeNames.specifyJSONObjectTypeName;
  }
  isIntegerNumber(): this is TokenState<'integerNumber'> {
    return this.type === designTokenTypeNames.specifyIntegerNumberTypeName;
  }
  isZeroToOneNumber(): this is TokenState<'zeroToOneNumber'> {
    return this.type === designTokenTypeNames.specifyZeroToOneNumberTypeName;
  }
  isArcDegreeNumber(): this is TokenState<'arcDegreeNumber'> {
    return this.type === designTokenTypeNames.specifyArcDegreeNumberTypeName;
  }
  isRgbColorNumber(): this is TokenState<'rgbColorNumber'> {
    return this.type === designTokenTypeNames.specifyRGBColorNumberTypeName;
  }
  isPositiveNumber(): this is TokenState<'positiveNumber'> {
    return this.type === designTokenTypeNames.specifyPositiveNumberTypeName;
  }
  isPositiveIntegerNumber(): this is TokenState<'positiveIntegerNumber'> {
    return this.type === designTokenTypeNames.specifyPositiveIntegerNumberTypeName;
  }
  isPercentageNumber(): this is TokenState<'percentageNumber'> {
    return this.type === designTokenTypeNames.specifyPercentageNumberTypeName;
  }
  isHexadecimalColorString(): this is TokenState<'hexadecimalColorString'> {
    return this.type === designTokenTypeNames.specifyHexadecimalColorStringTypeName;
  }
  isBitmap(): this is TokenState<'bitmap'> {
    return this.type === designTokenTypeNames.specifyBitmapTypeName;
  }
  isBitmapFormat(): this is TokenState<'bitmapFormat'> {
    return this.type === designTokenTypeNames.specifyBitmapFormatTypeName;
  }
  isBlur(): this is TokenState<'blur'> {
    return this.type === designTokenTypeNames.specifyBlurTypeName;
  }
  isBorder(): this is TokenState<'border'> {
    return this.type === designTokenTypeNames.specifyBorderTypeName;
  }
  isBorderStyle(): this is TokenState<'borderStyle'> {
    return this.type === designTokenTypeNames.specifyBorderStyleTypeName;
  }
  isBorderStyleLineCap(): this is TokenState<'borderStyleLineCap'> {
    return this.type === designTokenTypeNames.specifyBorderStyleLineCapTypeName;
  }
  isBreakpoint(): this is TokenState<'breakpoint'> {
    return this.type === designTokenTypeNames.specifyBreakpointTypeName;
  }
  isColor(): this is TokenState<'color'> {
    return this.type === designTokenTypeNames.specifyColorTypeName;
  }
  isCubicBezier(): this is TokenState<'cubicBezier'> {
    return this.type === designTokenTypeNames.specifyCubicBezierTypeName;
  }
  isDimension(): this is TokenState<'dimension'> {
    return this.type === designTokenTypeNames.specifyDimensionTypeName;
  }
  isDimensionUnit(): this is TokenState<'dimensionUnit'> {
    return this.type === designTokenTypeNames.specifyDimensionUnitTypeName;
  }
  isDuration(): this is TokenState<'duration'> {
    return this.type === designTokenTypeNames.specifyDurationTypeName;
  }
  isDurationUnit(): this is TokenState<'durationUnit'> {
    return this.type === designTokenTypeNames.specifyDurationUnitTypeName;
  }
  isFont(): this is TokenState<'font'> {
    return this.type === designTokenTypeNames.specifyFontTypeName;
  }
  isFontFamily(): this is TokenState<'fontFamily'> {
    return this.type === designTokenTypeNames.specifyFontFamilyTypeName;
  }
  isFontFeature(): this is TokenState<'fontFeature'> {
    return this.type === designTokenTypeNames.specifyFontFeatureTypeName;
  }
  isFontFeatures(): this is TokenState<'fontFeatures'> {
    return this.type === designTokenTypeNames.specifyFontFeaturesTypeName;
  }
  isFontFormat(): this is TokenState<'fontFormat'> {
    return this.type === designTokenTypeNames.specifyFontFormatTypeName;
  }
  isFontStyle(): this is TokenState<'fontStyle'> {
    return this.type === designTokenTypeNames.specifyFontStyleTypeName;
  }
  isFontWeight(): this is TokenState<'fontWeight'> {
    return this.type === designTokenTypeNames.specifyFontWeightTypeName;
  }
  isGradient(): this is TokenState<'gradient'> {
    return this.type === designTokenTypeNames.specifyGradientTypeName;
  }
  isGradients(): this is TokenState<'gradients'> {
    return this.type === designTokenTypeNames.specifyGradientsTypeName;
  }
  isOpacity(): this is TokenState<'opacity'> {
    return this.type === designTokenTypeNames.specifyOpacityTypeName;
  }
  isRadius(): this is TokenState<'radius'> {
    return this.type === designTokenTypeNames.specifyRadiusTypeName;
  }
  isRadii(): this is TokenState<'radii'> {
    return this.type === designTokenTypeNames.specifyRadiiTypeName;
  }
  isShadow(): this is TokenState<'shadow'> {
    return this.type === designTokenTypeNames.specifyShadowTypeName;
  }
  isShadows(): this is TokenState<'shadows'> {
    return this.type === designTokenTypeNames.specifyShadowsTypeName;
  }
  isShadowType(): this is TokenState<'shadowType'> {
    return this.type === designTokenTypeNames.specifyShadowTypeTypeName;
  }
  isSpacing(): this is TokenState<'spacing'> {
    return this.type === designTokenTypeNames.specifySpacingTypeName;
  }
  isSpacings(): this is TokenState<'spacings'> {
    return this.type === designTokenTypeNames.specifySpacingsTypeName;
  }
  isStepsTimingFunction(): this is TokenState<'stepsTimingFunction'> {
    return this.type === designTokenTypeNames.specifyStepsTimingFunctionTypeName;
  }
  isTextAlignHorizontal(): this is TokenState<'textAlignHorizontal'> {
    return this.type === designTokenTypeNames.specifyTextAlignHorizontalTypeName;
  }
  isTextAlignVertical(): this is TokenState<'textAlignVertical'> {
    return this.type === designTokenTypeNames.specifyTextAlignVerticalTypeName;
  }
  isTextDecoration(): this is TokenState<'textDecoration'> {
    return this.type === designTokenTypeNames.specifyTextDecorationTypeName;
  }
  isTextStyle(): this is TokenState<'textStyle'> {
    return this.type === designTokenTypeNames.specifyTextStyleTypeName;
  }
  isTextTransform(): this is TokenState<'textTransform'> {
    return this.type === designTokenTypeNames.specifyTextTransformTypeName;
  }
  isTransition(): this is TokenState<'transition'> {
    return this.type === designTokenTypeNames.specifyTransitionTypeName;
  }
  isVector(): this is TokenState<'vector'> {
    return this.type === designTokenTypeNames.specifyVectorTypeName;
  }
  isVectorFormat(): this is TokenState<'vectorFormat'> {
    return this.type === designTokenTypeNames.specifyVectorFormatTypeName;
  }
  isZIndex(): this is TokenState<'zIndex'> {
    return this.type === designTokenTypeNames.specifyZIndexTypeName;
  }
  /* v8 ignore stop */
}
