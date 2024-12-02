import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyArcDegreeNumberValue,
  SpecifyZeroToOneNumberValue,
} from '../../../src/definitions/tokenTypes/_numbers.js';
import { ArrayWithAtLeastOneElement } from '../../../src/utils/typeUtils.js';
import { SpecifyColorValue } from '../../../src/definitions/tokenTypes/color.js';
import { SpecifyJSONStringValue } from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyArcDegreeNumberTypeName,
  specifyColorTypeName,
  specifyGradientTypeName,
  specifyJSONStringTypeName,
  specifyRGBColorNumberTypeName,
  specifyZeroToOneNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyGradientValueSchema,
  specifyGradientDefinition,
  SpecifyGradientValue,
  SpecifyGradientValueWithAlias,
} from '../../../src/definitions/tokenTypes/gradient.js';

describe.concurrent('gradient', () => {
  describe.concurrent('makeSpecifyGradientValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a gradient value', () => {
      const colorStops = [
        {
          color: {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
          position: 0,
        },
        {
          color: {
            model: 'hex',
            hex: '#ffffff',
            alpha: 1,
          },
          position: 1,
        },
      ];

      const inputForLinear = {
        type: 'linear',
        angle: 45,
        colorStops,
      };
      const result = makeSpecifyGradientValueSchema(isNotSupportingAliasing).parse(inputForLinear);
      expect(result).toStrictEqual(inputForLinear);
      type Result = Expect<
        Equal<
          typeof result,
          | {
              type: 'linear';
              angle: SpecifyArcDegreeNumberValue;
              colorStops: ArrayWithAtLeastOneElement<{
                color: SpecifyColorValue;
                position: SpecifyZeroToOneNumberValue;
              }>;
            }
          | {
              type: 'radial';
              position: SpecifyJSONStringValue;
              colorStops: ArrayWithAtLeastOneElement<{
                color: SpecifyColorValue;
                position: SpecifyZeroToOneNumberValue;
              }>;
            }
          | {
              type: 'conic';
              angle: SpecifyArcDegreeNumberValue;
              position: SpecifyJSONStringValue;
              colorStops: ArrayWithAtLeastOneElement<{
                color: SpecifyColorValue;
                position: SpecifyZeroToOneNumberValue;
              }>;
            }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyGradientValue>>;

      const inputForRadial = {
        type: 'radial',
        position: 'center',
        colorStops,
      };
      expect(
        makeSpecifyGradientValueSchema(isNotSupportingAliasing).parse(inputForRadial),
      ).toStrictEqual(inputForRadial);

      const inputForConic = {
        type: 'conic',
        angle: 48,
        position: 'center',
        colorStops,
      };
      expect(
        makeSpecifyGradientValueSchema(isNotSupportingAliasing).parse(inputForConic),
      ).toStrictEqual(inputForConic);
    });
    it('Should fail validating a gradient value with empty colorStop array', () => {
      expect(() =>
        makeSpecifyGradientValueSchema(isNotSupportingAliasing).parse({
          type: 'linear',
          angle: 45,
          colorStops: [],
        }),
      ).toThrow();
    });
    it('Should fail validating a gradient value with extra properties', () => {
      expect(() =>
        makeSpecifyGradientValueSchema(isNotSupportingAliasing).parse({
          type: 'linear',
          angle: 45,
          colorStops: [{ color: { model: 'hex', hex: '#000000', alpha: 1 }, position: 0 }],
          extra: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a gradient value with missing properties', () => {
      expect(() => makeSpecifyGradientValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a gradient value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.gradient',
        $mode: 'default',
      };
      const result = makeSpecifyGradientValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyGradientValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyGradientValueWithAlias>>;
    });
    it('Should validate an alias for a gradient value sub keys', () => {
      const colorStops: Extract<SpecifyGradientValueWithAlias, { colorStops: any }>['colorStops'] =
        [
          {
            color: { $alias: 'some.color', $mode: 'default' },
            position: 0,
          },
          {
            color: {
              model: 'hex',
              hex: '#ffffff',
              alpha: 1,
            },
            position: 1,
          },
        ];

      const inputForLinear: Extract<SpecifyGradientValueWithAlias, { type: 'linear' }> = {
        type: 'linear',
        angle: { $alias: 'gradient.alias.angle', $mode: 'default' },
        colorStops,
      };
      expect(
        makeSpecifyGradientValueSchema(isSupportingAliasing).parse(inputForLinear),
      ).toStrictEqual(inputForLinear);

      const inputForRadial: Extract<SpecifyGradientValueWithAlias, { type: 'radial' }> = {
        type: 'radial',
        position: { $alias: 'gradient.alias.position', $mode: 'default' },
        colorStops,
      };
      expect(
        makeSpecifyGradientValueSchema(isSupportingAliasing).parse(inputForRadial),
      ).toStrictEqual(inputForRadial);

      const inputForConic: Extract<SpecifyGradientValueWithAlias, { type: 'conic' }> = {
        type: 'conic',
        angle: { $alias: 'gradient.alias.angle', $mode: 'default' },
        position: { $alias: 'gradient.alias.position', $mode: 'default' },
        colorStops,
      };
      expect(
        makeSpecifyGradientValueSchema(isSupportingAliasing).parse(inputForConic),
      ).toStrictEqual(inputForConic);
    });
  });
  describe.concurrent('specifyGradientDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyGradientTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          'linear',
          new ValuePath(['type']),
          () => 'linear',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyArcDegreeNumberTypeName,
          new ValuePath(['angle']),
          () => 'linear',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['colorStops', '0', 'color']),
          () => 'linear',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['colorStops', '0', 'position']),
          () => 'linear',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          'radial',
          new ValuePath(['type']),
          () => 'radial',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['position']),
          () => 'radial',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['colorStops', '0', 'color']),
          () => 'radial',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['colorStops', '0', 'position']),
          () => 'radial',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          'conic',
          new ValuePath(['type']),
          () => 'conic',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyArcDegreeNumberTypeName,
          new ValuePath(['angle']),
          () => 'conic',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['position']),
          () => 'conic',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['colorStops', '0', 'color']),
          () => 'conic',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['colorStops', '0', 'position']),
          () => 'conic',
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token sub-type of color in color stops', () => {
      expect(
        specifyGradientDefinition.matchTokenTypeAgainstMapping(
          specifyRGBColorNumberTypeName,
          new ValuePath(['colorStops', '0', 'color', 'red']),
          path => {
            if (path.join(',') === 'type') {
              return 'linear';
            }
            if (path.includes('model')) {
              return 'rgb';
            }
            return '';
          },
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
