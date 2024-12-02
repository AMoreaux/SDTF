# Specify Design Token Format

The Specify Design Token Format (SDTF) is a JSON based notation capturing the architecture of information of Design Tokens. Supporting 50+ token types, the SDTF allows to compose the most complex ones by referencing/aliasing others.

The SDTF is a transport format, hence if it can be read easily, we do not recommend writing its content directly. Instead, use the APIs provided by Specify.

## Usage

### Use the SDTF engine

The `createSDTFEngine` is the package main function to work with any SDTF token tree.

```typescript
import {
  matchIsDimensionTokenState,
  createSDTFEngine,
  SpecifyDesignTokenFormat,
} from './src/index.js';

const tokens: SpecifyDesignTokenFormat = {
  // ...
};

const sdtfEngine = createSDTFEngine(tokens);

// To start exploring the graph, you can grab the children of the root node:
const groupStates = sdtfEngine.query.getGroupChildren();
const collectionStates = sdtfEngine.query.getCollectionChildren();
const tokenStates = sdtfEngine.query.getTokenChildren();

// let's pretend we have data in tokenStates, we can iterate over it:
tokenStates.forEach(tokenState => {
  // match[tokenType]TokenState functions are available for all token types
  // We narrow down the type of tokenState to DimensionTokenState
  if (matchIsDimensionTokenState(tokenState)) {
    // We can now use the TokenState API with proper typing

    // To get the JSON value
    const resolvedValue = tokenState.getJSONValue();
    const initialValue = tokenState.getJSONValue({ resolveAliases: false });
    const resolvedValueWithoutUnresolvableAliases = tokenState.getJSONValue({
      resolveAliases: true,
      allowUnresolvable: false,
    });
    const resolvedValueForAGivenMode = tokenState.getJSONValue({
      resolveAliases: true,
      targetMode: 'small',
    });

    // To get the JSON token — all getJSONValue options are available here too
    const resolvedToken = tokenState.getJSONToken();

    // To get the stateful value
    const statefulValue = tokenState.getStatefulValueResult();

    // To get the collection the token belongs to
    const collectionState = tokenState.getCollection();
  }
});

// To dive into a specific node, you can use the path to that node:
const getGroupResult = sdtfEngine.query.getGroupState(['basis', 'spacing']);
const getCollectionResult = sdtfEngine.query.getCollectionState(['basis', 'spacing']);
const getTokenResult = sdtfEngine.query.getTokenState(['basis', 'spacing', 'base']);

// To get all node instances of a given type
const allTokenStates = sdtfEngine.query.getAllTokenStates();
const allGroupStates = sdtfEngine.query.getAllGroupStates();
const allCollectionStates = sdtfEngine.query.getAllCollectionStates();
const allNodeStates = sdtfEngine.query.getAllNodeStates();

// When iterating on allNodeStates, you can use the type guard to narrow down the type of the node
allNodeStates.forEach(nodeState => {
  if (nodeState.isToken) {
    const tokenState = nodeState;
  } else if (nodeState.isGroup) {
    const groupState = nodeState;
  } else if (nodeState.isCollection) {
    const collectionState = nodeState;
  }
});

```

### Run a custom query

```typescript
import { createSDTFEngine, SpecifyDesignTokenFormat } from './index.js';

const tokens: SpecifyDesignTokenFormat = {
  // ...
};

const sdtfEngine = createSDTFEngine(tokens);

const queryResults = sdtfEngine.query.run({
  where: {
    token: '.*',
    select: {
      token: true,
      parents: true,
    },
  },
});

// We can simply iterate over results
queryResults.forEach(treeNode => {
  // ...
});

// Or we can use the built-in methods

// The `isContinuous` property tells whether the resulting nodes are part of the same tree branch
if (queryResults.isContinuous === true) {
}

// The render method evaluates the returned nodes and group them by continuous branches
const queryResultDetails = queryResults.render();

queryResultDetails.forEach(queryResultDetail => {
  queryResultDetail.isComplete; // tells whether the graph section holds all initial nodes
  queryResultDetail.isRoot; // tells whether the graph section is bound to the tree root
  queryResultDetail.nodes; // holds the nodes of the rebuilt graph section
  queryResultDetail.sdtf; // holds the JSON representation of the rebuilt graph section
});

```


### Mutate Token tree states

```typescript
import {createSDTFEngine, SpecifyDesignTokenFormat} from './index.js';

const tokens: SpecifyDesignTokenFormat = {
  // ...
};

const sdtfEngine = createSDTFEngine(tokens);

// Replace the current token tree with a new one
sdtfEngine.mutation.loadTokenTree({tokens: {}});

// Empty the current token tree
sdtfEngine.mutation.resetTokenTree();

// Rename nodes
sdtfEngine.mutation.renameToken({atPath: ['colors', 'red'], name: 'red-500'});
sdtfEngine.mutation.renameGroup({atPath: ['colors'], name: 'colours'});
sdtfEngine.mutation.renameCollection({atPath: ['colors', 'shade'], name: 'shades'});

// Rename modes
sdtfEngine.mutation.renameTokenMode({
  atPath: ['colors', 'red'],
  fromMode: 'light',
  toMode: 'Light',
});
sdtfEngine.mutation.renameCollectionMode({
  atPath: ['colors'],
  fromMode: 'light',
  toMode: 'Light',
});

// Update token value
sdtfEngine.mutation.updateTokenValue({
  atPath: ['colors', 'red'],
  value: {
    // We must specify all modes
    Light: {model: 'hex', hex: '#6B0404', alpha: 1},
    Dark: {model: 'hex', hex: '#D71212', alpha: 1},
  },
});
sdtfEngine.mutation.updateTokenModeValue({
  atPath: ['colors', 'red'],
  mode: 'Light',
  value: {model: 'hex', hex: '#FF0000', alpha: 1},
});

// Add nodes
sdtfEngine.mutation.addToken({
  parentPath: ['colors'],
  name: 'red-500',
  tokenProperties: {
    $type: 'color',
    $value: {default: {model: 'hex', hex: '#FF0000', alpha: 1}},
  },
});
sdtfEngine.mutation.addGroup({
  parentPath: [],
  name: 'core',
  groupProperties: {},
});
sdtfEngine.mutation.addCollection({
  parentPath: [],
  name: 'colors',
  collectionProperties: {
    $collection: {
      $modes: ['Light', 'Dark'],
    },
  },
});

// More APIs available in the `createSDTFEngine.mutation` namespace
```

## Token tree example

```typescript
const tokens: SpecifyDesignTokenFormat = {
  basis: {
    unit: {
      base: { $type: 'integerNumber', $value: { default: 4 } },
      '2x': { $type: 'integerNumber', $value: { default: 8 } },
      '3x': { $type: 'integerNumber', $value: { default: 12 } },
    },
    brandColors: {
      light: {
        $type: 'color',
        $value: {
          lighter: { model: 'hex', hex: '#E7E4FB', alpha: 1 },
          light: { model: 'hex', hex: '#8A78EE', alpha: 1 },
          base: { model: 'hex', hex: '#624DE3', alpha: 1 },
          dark: { model: 'hex', hex: '#4938C3', alpha: 1 },
        },
      },
      dark: {
        $type: 'color',
        $value: {
          lighter: { model: 'hex', hex: '#362A79', alpha: 1 },
          light: { model: 'hex', hex: '#5443BC', alpha: 1 },
          base: { model: 'hex', hex: '#624DE3', alpha: 1 },
          dark: { model: 'hex', hex: '#9A90DF', alpha: 1 },
        },
      },
    },
  },
  spacing: {
    $collection: { $modes: ['small', 'large'] },
    base: {
      $type: 'spacing',
      $value: {
        small: { unit: 'px', value: { $alias: 'basis.unit.base', $mode: 'default' } },
        large: { unit: 'px', value: { $alias: 'basis.unit.2x', $mode: 'default' } },
      },
    },
    double: {
      $type: 'spacing',
      $value: {
        small: { unit: 'px', value: { $alias: 'basis.unit.2x', $mode: 'default' } },
        large: { unit: 'px', value: { $alias: 'basis.unit.3x', $mode: 'default' } },
      },
    },
  },
  themes: {
    $collection: { $modes: ['light', 'dark'] },
    primary: {
      $type: 'color',
      $value: {
        light: { $alias: 'basis.brandColors.light', $mode: 'base' },
        dark: { $alias: 'basis.brandColors.dark', $mode: 'base' },
      },
    },
  },
};
```
