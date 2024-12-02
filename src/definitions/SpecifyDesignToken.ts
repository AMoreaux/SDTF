import {
  DesignTokenDistributedOverDefinitionsUnion,
  SpecifyDesignTokenTypeName,
} from './designTokenDefinitions.js';

export type SpecifyDesignToken<
  Mode extends string = string,
  WithAliases extends boolean = true,
  WithModes extends boolean = true,
> = DesignTokenDistributedOverDefinitionsUnion<Mode, WithAliases, WithModes>;

export type SpecifyAliasableDesignToken = SpecifyDesignToken<string, true, true>;
export type SpecifyNonAliasableDesignToken = SpecifyDesignToken<string, false, true>;

export type PickSpecifyDesignToken<
  TypeName extends string = SpecifyDesignTokenTypeName,
  Mode extends string = string,
  WithAliases extends boolean = true,
  WithModes extends boolean = true,
> = TypeName extends SpecifyDesignTokenTypeName
  ? Extract<SpecifyDesignToken<Mode, WithAliases, WithModes>, { $type: TypeName }>
  : never;
