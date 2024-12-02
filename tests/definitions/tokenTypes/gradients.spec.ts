import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { ArrayWithAtLeastOneElement } from '../../../src/utils/typeUtils.js';
import {
  SpecifyGradientValue,
  SpecifyGradientValueWithAlias,
} from '../../../src/definitions/tokenTypes/gradient.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyGradientsValueSchema,
  specifyGradientsDefinition,
  SpecifyGradientsValue,
  SpecifyGradientsValueWithAlias,
} from '../../../src/definitions/tokenTypes/gradients.js';
import {
  specifyArcDegreeNumberTypeName,
  specifyColorTypeName,
  specifyGradientsTypeName,
  specifyGradientTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

describe.concurrent('gradients', () => {
  describe.concurrent('makeSpecifyGradientsValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a gradients value', () => {
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
      const inputForRadial = {
        type: 'radial',
        position: 'center',
        colorStops,
      };
      const inputForConic = {
        type: 'conic',
        angle: 48,
        position: 'center',
        colorStops,
      };

      const result = makeSpecifyGradientsValueSchema(isNotSupportingAliasing).parse([
        inputForLinear,
        inputForRadial,
        inputForConic,
      ]);
      expect(result).toStrictEqual([inputForLinear, inputForRadial, inputForConic]);
      type Result = Expect<Equal<typeof result, ArrayWithAtLeastOneElement<SpecifyGradientValue>>>;
      type Declaration = Expect<Equal<typeof result, SpecifyGradientsValue>>;
    });
    it('Should fail validating a gradients value with empty array', () => {
      expect(() => makeSpecifyGradientsValueSchema(isNotSupportingAliasing).parse([])).toThrow();
    });
    it('Should validate an alias for a gradients value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.gradients',
        $mode: 'default',
      };
      const result = makeSpecifyGradientsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          WithModeAndValueLevelAlias<ArrayWithAtLeastOneElement<SpecifyGradientValueWithAlias>>
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyGradientsValueWithAlias>>;
    });
    it('Should validate an alias for a gradients value array item', () => {
      const input: SpecifyGradientsValueWithAlias = [
        {
          $alias: 'some.gradient',
          $mode: 'default',
        },
      ];
      const result = makeSpecifyGradientsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a gradients value sub keys', () => {
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
      ] as any;

      const inputForLinear: Extract<SpecifyGradientValueWithAlias, { type: 'linear' }> = {
        type: 'linear',
        angle: { $alias: 'gradient.alias.angle', $mode: 'default' },
        colorStops,
      };
      const inputForRadial: Extract<SpecifyGradientValueWithAlias, { type: 'radial' }> = {
        type: 'radial',
        position: { $alias: 'gradient.alias.position', $mode: 'default' },
        colorStops,
      };
      const inputForConic: Extract<SpecifyGradientValueWithAlias, { type: 'conic' }> = {
        type: 'conic',
        angle: { $alias: 'gradient.alias.angle', $mode: 'default' },
        position: { $alias: 'gradient.alias.position', $mode: 'default' },
        colorStops,
      };

      const result = makeSpecifyGradientsValueSchema(isSupportingAliasing).parse([
        inputForLinear,
        inputForRadial,
        inputForConic,
      ]);
      expect(result).toStrictEqual([inputForLinear, inputForRadial, inputForConic]);
    });
  });
  describe.concurrent('specifyGradientsDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyGradientsDefinition.matchTokenTypeAgainstMapping(
          specifyGradientsTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyGradientsDefinition.matchTokenTypeAgainstMapping(
          specifyGradientTypeName,
          new ValuePath(['0']),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of nested gradient values sub-types', () => {
      expect(
        specifyGradientsDefinition.matchTokenTypeAgainstMapping(
          specifyArcDegreeNumberTypeName,
          new ValuePath(['0', 'angle']),
          () => 'linear',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyGradientsDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['0', 'colorStops', '0', 'color']),
          () => 'linear',
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
