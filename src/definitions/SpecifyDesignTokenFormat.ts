import { SpecifyDesignTokenGroupProperties } from './internals/designTokenGroup.js';
import { SpecifyDesignToken } from './SpecifyDesignToken.js';
import { SpecifyDesignTokenCollectionProperties } from './internals/designTokenCollection.js';

// The regular SDTF as of expected for serialization
export type SpecifyDesignTokenFormat = SpecifyDesignTokenTree<true>;

export type SpecifyDesignTokenTree<WithAliases extends boolean = true> = {
  [name: string]:
    | SpecifyDesignToken<string, WithAliases, true>
    | SpecifyDesignTokenGroupProperties
    | SpecifyDesignTokenCollectionProperties
    | SpecifyDesignTokenTree<WithAliases>;
};
