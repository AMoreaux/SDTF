import { getMockedDesignTokenValue } from './getMockedDesignTokenValue.js';
import { PickSpecifyDesignToken, SpecifyDesignTokenTypeName } from '../definitions/index.js';

export function getMockedDesignToken<
  Type extends SpecifyDesignTokenTypeName,
  Target extends PickSpecifyDesignToken<Type>,
>(options: {
  type: Type;
  value?: Partial<Target['$value']>;
  description?: string;
  extensions?: Record<string, unknown>;
}): Target {
  const { type, value, extensions, description } = options;
  const $value = value ?? { default: getMockedDesignTokenValue(type as any) };

  return {
    $type: type,
    $value,
    /* v8 ignore start */
    ...(description ? { $description: description } : {}),
    ...(extensions ? { $extensions: extensions } : {}),
    /* v8 ignore stop */
  } as unknown as Target;
}
