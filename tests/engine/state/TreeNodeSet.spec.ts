import { describe, it, expect } from 'vitest';

import { TreeNodeSet } from '../../../src/engine/state/TreeNodeSet.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('TreeNodeSet', () => {
  describe.concurrent('constructor', () => {
    it('should create a new TreeNodeSet of custom elements', () => {
      const nodeSet = new TreeNodeSet();
      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);

      expect(nodeSet.all).toEqual([node]);
    });
  });
  describe.concurrent('get all', () => {
    it('should return all finalNodes', () => {
      const nodeSet = new TreeNodeSet();
      const node1 = {
        path: new TreePath(['test1']),
        stringPath: 'test1',
      };
      const node2 = {
        path: new TreePath(['test2']),
        stringPath: 'test2',
      };
      nodeSet.add(node1);
      nodeSet.add(node2);

      expect(nodeSet.all).toEqual([node1, node2]);
    });
  });
  describe.concurrent('Symbol.iterator', () => {
    it('should iterate over all finalNodes', () => {
      const nodeSet = new TreeNodeSet();
      const node1 = {
        path: new TreePath(['test1']),
        stringPath: 'test1',
      };
      nodeSet.add(node1);

      // Spread operator
      expect([...nodeSet]).toEqual([node1]);

      // for...of
      let acc = [];
      for (const node of nodeSet) {
        acc.push(node);
      }
      expect(acc).toEqual([node1]);
    });
  });
  describe.concurrent('add', () => {
    it('should add a node', () => {
      const nodeSet = new TreeNodeSet();

      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);

      expect(nodeSet.all).toEqual([node]);
    });
  });
  describe.concurrent('delete', () => {
    it('should delete a node', () => {
      const nodeSet = new TreeNodeSet();
      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);
      const hasDeleted = nodeSet.delete('test');

      expect(hasDeleted).toBe(true);
      expect(nodeSet.all).toEqual([]);
    });
    it('should return false if the node does not exist', () => {
      const nodeSet = new TreeNodeSet();
      const hasDeleted = nodeSet.delete('test');

      expect(hasDeleted).toBe(false);
    });
  });
  describe.concurrent('clear', () => {
    it('should clear all finalNodes', () => {
      const nodeSet = new TreeNodeSet();
      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);

      nodeSet.clear();

      expect(nodeSet.all).toEqual([]);
    });
  });
  describe.concurrent('hasFrom', () => {
    it('should return true if node exists', () => {
      const nodeSet = new TreeNodeSet();
      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);

      expect(nodeSet.has('test')).toBe(true);
      expect(nodeSet.has(new TreePath(['test']))).toBe(true);
    });
    it('should return false if node does not exist', () => {
      const nodeSet = new TreeNodeSet();
      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);

      expect(nodeSet.has('test2')).toBe(false);
      expect(nodeSet.has(new TreePath(['test2']))).toBe(false);
    });
  });
  describe.concurrent('getOne', () => {
    it('should return the node if it exists', () => {
      const nodeSet = new TreeNodeSet();
      const node = {
        path: new TreePath(['test']),
        stringPath: 'test',
      };
      nodeSet.add(node);

      expect(nodeSet.getOne('test')).toBe(node);
      expect(nodeSet.getOne(new TreePath(['test']))).toBe(node);
    });
    it('should return undefined if the node does not exist', () => {
      const nodeSet = new TreeNodeSet();

      expect(nodeSet.getOne('test')).toBe(undefined);
    });
  });
  describe.concurrent('getChildrenOf', () => {
    it('should return the children of the node if it exists', () => {
      const nodeSet = new TreeNodeSet();
      const rootNode = {
        path: new TreePath(['root']),
        stringPath: 'root',
      };
      const nestedNode = {
        path: new TreePath(['root', 'nested']),
        stringPath: 'root.nested',
      };
      const deepNestedNode = {
        path: new TreePath(['root', 'nested', 'deepNested']),
        stringPath: 'root.nested.deepNested',
      };
      const siblingToRootNode = {
        path: new TreePath(['sibling']),
        stringPath: 'sibling',
      };
      nodeSet.add(rootNode);
      nodeSet.add(nestedNode);
      nodeSet.add(deepNestedNode);
      nodeSet.add(siblingToRootNode);

      expect(nodeSet.getChildrenOf(new TreePath(['root']))).toEqual([nestedNode, deepNestedNode]);
    });
    it('should return the children of the node at the given depth', () => {
      const nodeSet = new TreeNodeSet();
      const rootNode = {
        path: new TreePath(['root']),
        stringPath: 'root',
      };
      const nestedNode = {
        path: new TreePath(['root', 'nested']),
        stringPath: 'root.nested',
      };
      const deepNestedNode = {
        path: new TreePath(['root', 'nested', 'deepNested']),
        stringPath: 'root.nested.deepNested',
      };
      const siblingToRootNode = {
        path: new TreePath(['sibling']),
        stringPath: 'sibling',
      };
      nodeSet.add(rootNode);
      nodeSet.add(nestedNode);
      nodeSet.add(deepNestedNode);
      nodeSet.add(siblingToRootNode);

      expect(nodeSet.getChildrenOf(new TreePath(['root']), 1)).toEqual([nestedNode]);
    });
    it('should not return a group starting with the same name but sibling of it', () => {
      const nodeSet = new TreeNodeSet();

      const rootNode = {
        path: new TreePath(['root']),
        stringPath: 'root',
      };
      const nestedNode1 = {
        path: new TreePath(['root', 'groupNestedInGroup1']),
        stringPath: 'root.groupNestedInGroup1',
      };
      const deepNestedNode1 = {
        path: new TreePath(['root', 'aGroup', 'aGroupNestedInGroup1']),
        stringPath: 'root.aGroup.aGroupNestedInGroup1',
      };
      const nestedNode2 = {
        path: new TreePath(['root', 'aGroupSibling']),
        stringPath: 'root.aGroupSibling',
      };
      const deepNestedNode2 = {
        path: new TreePath(['root', 'aGroupSibling', 'aGroupNestedInGroup2']),
        stringPath: 'root.aGroupSibling.aGroupNestedInGroup2',
      };

      nodeSet.add(rootNode);
      nodeSet.add(nestedNode1);
      nodeSet.add(deepNestedNode1);
      nodeSet.add(nestedNode2);
      nodeSet.add(deepNestedNode2);

      const results = nodeSet.getChildrenOf(new TreePath(['root', 'aGroup']));
      expect(results).toHaveLength(1);
      expect(results).toEqual([deepNestedNode1]);
    });
  });
  describe.concurrent('getParentsOf', () => {
    it('should return the parents of the node if it exists', () => {
      const nodeSet = new TreeNodeSet();

      const rootNode = {
        path: new TreePath(['aGroup']),
        stringPath: 'aGroup',
      };
      const aNestedNodeInRoot = {
        path: new TreePath(['aGroup', 'aNestedGroupInAGroup']),
        stringPath: 'aGroup.aNestedGroupInAGroup',
      };
      const aGroupWithALongerNameNode = {
        path: new TreePath(['aGroupWithALongerName']),
        stringPath: 'aGroupWithALongerName',
      };
      const aNestedGroupInALongerNameNode = {
        path: new TreePath(['aGroupWithALongerName', 'aNestedGroupInALongerName']),
        stringPath: 'aGroupWithALongerName.aNestedGroupInALongerName',
      };
      const aSubNestedInANestedGroupInALongerNameNode = {
        path: new TreePath([
          'aGroupWithALongerName',
          'aNestedGroupInALongerName',
          'aSubNestedInANestedGroupInALongerName',
        ]),
        stringPath:
          'aGroupWithALongerName.aNestedGroupInALongerName.aSubNestedInANestedGroupInALongerName',
      };
      nodeSet.add(rootNode);
      nodeSet.add(aNestedNodeInRoot);
      nodeSet.add(aGroupWithALongerNameNode);
      nodeSet.add(aNestedGroupInALongerNameNode);
      nodeSet.add(aSubNestedInANestedGroupInALongerNameNode);

      // Ordering is done from the closest parent to the furthest
      expect(
        nodeSet.getParentsOf(
          new TreePath([
            'aGroupWithALongerName',
            'aNestedGroupInALongerName',
            'aSubNestedInANestedGroupInALongerName',
          ]),
        ),
      ).toEqual([aNestedGroupInALongerNameNode, aGroupWithALongerNameNode]);

      expect(
        nodeSet.getParentsOf(new TreePath(['aGroupWithALongerName', 'aNestedGroupInALongerName'])),
      ).toEqual([aGroupWithALongerNameNode]);
    });
    it('should return the parents of the node at the given depth', () => {
      const nodeSet = new TreeNodeSet();

      const rootNode = {
        path: new TreePath(['root']),
        stringPath: 'root',
      };
      const nestedNode = {
        path: new TreePath(['root', 'nested']),
        stringPath: 'root.nested',
      };
      const subNestedNode = {
        path: new TreePath(['root', 'nested', 'sub-nested']),
        stringPath: 'root.nested.sub-nested',
      };
      const subSubNestedNode = {
        path: new TreePath(['root', 'nested', 'sub-nested', 'sub-sub']),
        stringPath: 'root.nested.sub-nested.sub-sub',
      };

      nodeSet.add(rootNode);
      nodeSet.add(nestedNode);
      nodeSet.add(subNestedNode);
      nodeSet.add(subSubNestedNode);

      // Ordering is done from the closest parent to the furthest
      expect(
        nodeSet.getParentsOf(new TreePath(['root', 'nested', 'sub-nested', 'sub-sub']), 1),
      ).toEqual([subNestedNode]);

      expect(
        nodeSet.getParentsOf(new TreePath(['root', 'nested', 'sub-nested', 'sub-sub']), 2),
      ).toEqual([subNestedNode, nestedNode]);
    });
  });
});
