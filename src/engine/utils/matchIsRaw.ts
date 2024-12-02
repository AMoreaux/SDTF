import { InnerValue, RawValueSignature } from '../index.js';

/* v8 ignore start */

export function matchIsRawColorHex(
  color: RawValueSignature<'color'>,
): color is Extract<RawValueSignature<'color'>, { model: InnerValue<'hex'> }> {
  return color.model.unwrapValue() === 'hex';
}
export function matchIsRawColorRgb(
  color: RawValueSignature<'color'>,
): color is Extract<RawValueSignature<'color'>, { model: InnerValue<'rgb'> }> {
  return color.model.unwrapValue() === 'rgb';
}
export function matchIsRawColorHsl(
  color: RawValueSignature<'color'>,
): color is Extract<RawValueSignature<'color'>, { model: InnerValue<'hsl'> }> {
  return color.model.unwrapValue() === 'hsl';
}
export function matchIsRawColorHsb(
  color: RawValueSignature<'color'>,
): color is Extract<RawValueSignature<'color'>, { model: InnerValue<'hsb'> }> {
  return color.model.unwrapValue() === 'hsb';
}
export function matchIsRawColorLch(
  color: RawValueSignature<'color'>,
): color is Extract<RawValueSignature<'color'>, { model: InnerValue<'lch'> }> {
  return color.model.unwrapValue() === 'lch';
}
export function matchIsRawColorLab(
  color: RawValueSignature<'color'>,
): color is Extract<RawValueSignature<'color'>, { model: InnerValue<'lab'> }> {
  return color.model.unwrapValue() === 'lab';
}

export function matchIsRawGradientConic(
  gradient: RawValueSignature<'gradient'>,
): gradient is Extract<RawValueSignature<'gradient'>, { type: InnerValue<'conic'> }> {
  return gradient.type.unwrapValue() === 'conic';
}
export function matchIsRawGradientLinear(
  gradient: RawValueSignature<'gradient'>,
): gradient is Extract<RawValueSignature<'gradient'>, { type: InnerValue<'linear'> }> {
  return gradient.type.unwrapValue() === 'linear';
}
export function matchIsRawGradientRadial(
  gradient: RawValueSignature<'gradient'>,
): gradient is Extract<RawValueSignature<'gradient'>, { type: InnerValue<'radial'> }> {
  return gradient.type.unwrapValue() === 'radial';
}

/* v8 ignore stop */
