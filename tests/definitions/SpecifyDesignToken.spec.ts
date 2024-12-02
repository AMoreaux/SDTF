import { describe, it } from 'vitest';

import {
  PickSpecifyDesignToken,
  SpecifyDesignToken,
} from '../../src/definitions/SpecifyDesignToken.js';

import { SpecifyDesignTokenDefaultMode } from '../../src/index.js';

describe('SpecifyDesignToken', () => {
  it('Should match the various return types', () => {
    const matchedWithRawValueAndAnyModeWithModes: SpecifyDesignToken<string, true, true> = {
      $type: 'dimension',
      $value: { anyMode: { unit: 'px', value: 8 } },
    };
    const matchedWithTopLevelAliasAndAnyModeWithModes: SpecifyDesignToken<string, true, true> = {
      $type: 'dimension',
      $value: { $alias: 'some.alias' },
    };
    const matchedWithModeLevelAliasAndAnyModeWithModes: SpecifyDesignToken<string, true, true> = {
      $type: 'dimension',
      $value: { anyMode: { $alias: 'some.alias', $mode: 'targetMode' } },
    };
    const matchedWithValueLevelAliasAndAnyModeWithModes: SpecifyDesignToken<string, true, true> = {
      $type: 'dimension',
      $value: { anyMode: { unit: { $alias: 'some.alias', $mode: 'targetMode' }, value: 8 } },
    };
    const matchedWithRawValueAndAnyModeWithoutModes: SpecifyDesignToken<string, true, false> = {
      $type: 'dimension',
      $value: { unit: 'px', value: 8 },
    };
    // Note that Top level aliases are not allowed without modes
    const matchedWithTopLevelAliasAndAnyModeWithoutModes: SpecifyDesignToken<string, true, false> =
      {
        $type: 'dimension',
        $value: { $alias: 'some.alias', $mode: 'targetMode' }, // fallback on ModeAndValueLevelAlias
      };
    const matchedWithValueLevelAliasAndAnyModeWithoutModes: SpecifyDesignToken<
      string,
      true,
      false
    > = {
      $type: 'dimension',
      $value: { unit: { $alias: 'some.alias', $mode: 'targetMode' }, value: 10 },
    };

    const matchedWithRawValueAndCustomModeWithModes: SpecifyDesignToken<'custom', true, true> = {
      $type: 'dimension',
      $value: { custom: { unit: 'px', value: 8 } },
    };
    const matchedWithTopLevelAliasAndCustomModeWithModes: SpecifyDesignToken<'custom', true, true> =
      {
        $type: 'dimension',
        $value: { $alias: 'some.alias' },
      };
    const matchedWithModeLevelAliasAndCustomModeWithModes: SpecifyDesignToken<
      'custom',
      true,
      true
    > = {
      $type: 'dimension',
      $value: { custom: { $alias: 'some.alias', $mode: 'targetMode' } },
    };
    const matchedWithValueLevelAliasAndCustomMode: SpecifyDesignToken<'custom', true, true> = {
      $type: 'dimension',
      $value: { custom: { unit: { $alias: 'some.alias', $mode: 'targetMode' }, value: 10 } },
    };
    const matchedWithRawValueAndCustomModeWithoutModes: SpecifyDesignToken<'custom', true, false> =
      {
        $type: 'dimension',
        $value: { unit: 'px', value: 8 },
      };
    // Note that Top level aliases are not allowed without modes
    const matchedWithTopLevelAliasAndCustomModeWithoutModes: SpecifyDesignToken<
      'custom',
      true,
      false
    > = {
      $type: 'dimension',
      $value: { $alias: 'some.alias', $mode: 'targetMode' }, // fallback on ModeAndValueLevelAlias
    };
    const matchedWithValueLevelAliasAndCustomModeWithoutModes: SpecifyDesignToken<
      'custom',
      true,
      false
    > = {
      $type: 'dimension',
      $value: { unit: { $alias: 'some.alias', $mode: 'targetMode' }, value: 10 },
    };

    const matchedWithNoAliasesAndAnyModeWithModes: SpecifyDesignToken<string, false, true> = {
      $type: 'dimension',
      $value: {
        anyMode: { unit: 'px', value: 8 },
      },
    };
    // String types are colliding with the $alias property
    const INCORECTLY_matchedWithNoTopLevelAliasesAndAnyModeWithModes: SpecifyDesignToken<
      string,
      false,
      true
    > = {
      $type: 'string',
      $value: { $alias: 'some.alias' },
    };
    // @ts-expect-error
    const matchedFailingWithNoTopLevelAliasesAndAnyModeWithModes: SpecifyDesignToken<
      string,
      false,
      true
    > = {
      $type: 'dimension',
      $value: { $alias: 'some.alias' },
    };

    const matchedFailingWithNoModeLevelAliasesAndAnyModeWithModes: SpecifyDesignToken<
      string,
      false,
      true
    > = {
      $type: 'dimension',
      $value: {
        anyMode: {
          // @ts-expect-error
          $alias: 'some.alias',
        },
      },
    };
    const matchedWithNoAliasesAndAnyModeWithoutModes: SpecifyDesignToken<string, false, false> = {
      $type: 'dimension',
      $value: { unit: 'px', value: 8 },
    };
    const matchedFailingWithNoTopLevelAliasesAndAnyModeWithoutModes: SpecifyDesignToken<
      string,
      false,
      false
    > = {
      $type: 'dimension',
      $value: {
        // @ts-expect-error
        $alias: 'some.alias',
      },
    };
    const matchedFailingWithNoModeLevelAliasesAndAnyModeWithoutModes: SpecifyDesignToken<
      string,
      false,
      false
    > = {
      $type: 'dimension',
      $value: {
        // @ts-expect-error
        anyMode: { $alias: 'some.alias' },
      },
    };
  });
});
describe('PickSpecifyDesignToken', () => {
  it('Should match the various return types', () => {
    const dimensionWithAliasesAndDefaultMode: PickSpecifyDesignToken<'dimension'> = {
      $type: 'dimension',
      $value: { default: { unit: 'px', value: { $alias: 'some.alias', $mode: 'targetMode' } } },
    };
    const dimensionWithTopLevelAlias: PickSpecifyDesignToken<'dimension'> = {
      $type: 'dimension',
      $value: { $alias: 'some.alias' },
    };
    const dimensionWithModeLevelAliasAndDefaultMode: PickSpecifyDesignToken<'dimension'> = {
      $type: 'dimension',
      $value: { default: { $alias: 'some.alias', $mode: 'targetMode' } },
    };
    const dimensionWithNoAliasesAndDefaultMode: PickSpecifyDesignToken<
      'dimension',
      SpecifyDesignTokenDefaultMode,
      false
    > = {
      $type: 'dimension',
      $value: {
        default: { unit: 'px', value: 10 },
      },
    };
    const dimensionFailingWithNoAliasesAndDefaultMode: PickSpecifyDesignToken<
      'dimension',
      SpecifyDesignTokenDefaultMode,
      false
    > = {
      $type: 'dimension',
      $value: {
        default: {
          // @ts-expect-error
          $alias: 'some.alias',
        },
      },
    };
    const dimensionWithAliasesAndCustomMode: PickSpecifyDesignToken<
      'dimension',
      'custom' | 'other'
    > = {
      $type: 'dimension',
      $value: {
        custom: { unit: 'px', value: 10 },
        other: { unit: 'px', value: 10 },
      },
    };
  });
});
