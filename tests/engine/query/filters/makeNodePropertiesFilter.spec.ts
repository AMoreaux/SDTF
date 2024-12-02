import { describe, it, expect } from 'vitest';
import { createSDTFEngine, SpecifyDesignTokenFormat } from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

import { makeNodePropertiesFilter } from '../../../../src/engine/query/filters/makeNodePropertiesFilter.js';

describe.concurrent('makeNodePropertiesFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    content: {
      title: {
        $type: 'string',
        $description: 'The title of the page',
        $value: { default: 'My page' },
      },
      subtitle: {
        $type: 'string',
        $description: 'The subtitle of the page',
        $value: { default: 'My subtitle' },
      },
      body: {
        $type: 'string',
        $description: 'The body of the page',
        $value: { default: 'My body content' },
      },
    },
  };

  it('should match any node when no properties are specified', () => {
    const regexes = {
      maybeNameRegex: undefined,
      maybeDescriptionRegex: undefined,
    };
    const filterFn = makeNodePropertiesFilter(regexes);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllNodeStates();

    const results = allNodes.filter(filterFn);

    expect(results).toEqual(allNodes);
  });
  it('should match on name property', () => {
    const regexes = {
      maybeNameRegex: /^title/,
      maybeDescriptionRegex: undefined,
    };
    const filterFn = makeNodePropertiesFilter(regexes);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllNodeStates();

    const results = allNodes.filter(filterFn);

    const nodePaths = results.map(node => node.path.toString());
    expect(nodePaths).toEqual(['content.title']);
  });
  it('should match on description property', () => {
    const regexes = {
      maybeNameRegex: undefined,
      maybeDescriptionRegex: /subtitle/,
    };
    const filterFn = makeNodePropertiesFilter(regexes);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllNodeStates();

    const results = allNodes.filter(filterFn);

    const nodePaths = results.map(node => node.path.toString());
    expect(nodePaths).toEqual(['content.subtitle']);
  });
  it('should not match an undefined description property', () => {
    const regexes = {
      maybeNameRegex: undefined,
      maybeDescriptionRegex: /subtitle/,
    };
    const filterFn = makeNodePropertiesFilter(regexes);

    const sdtfEngine = createSDTFEngine(tokens);
    const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['content']));
    if (!maybeGroupState) throw new Error('unresolvable');

    const result = filterFn(maybeGroupState);

    expect(result).toBe(false);
  });
  it('should match on name and description properties', () => {
    const regexes = {
      maybeNameRegex: /title/,
      maybeDescriptionRegex: /subtitle/,
    };
    const filterFn = makeNodePropertiesFilter(regexes);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllNodeStates();

    const results = allNodes.filter(filterFn);

    const nodePaths = results.map(node => node.path.toString());
    expect(nodePaths).toEqual(['content.subtitle']);
  });
});
