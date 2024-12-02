import { z } from 'zod';
import { makeRunQuery, parseQuery, SDTFQuery } from '../query/index.js';
import { TreeNodesState } from './TreeNodesState.js';
import { TreeState } from './TreeState.js';

export const serializedViewSchema = z.object({
  name: z.string(),
  query: z
    .custom<SDTFQuery>(v => v)
    .superRefine((value, ctx) => {
      try {
        parseQuery(value);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // TODO @Nico: improve error mapping
          error.issues.forEach(issue => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue.message,
            });
          });
        } else {
          const message =
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof error.message === 'string'
              ? error.message
              : 'Unknown SDTF query parsing error';
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: message,
          });
        }
      }
    }),
});

export type SerializedView = {
  name: string;
  query: SDTFQuery;
};

export class ViewState {
  #name: string;
  #query: SDTFQuery;
  #nodes: TreeNodesState;

  constructor(name: string, query: SDTFQuery, nodes: TreeNodesState = new TreeNodesState()) {
    this.#name = name;
    this.#query = query;
    this.#nodes = nodes;
  }

  get name() {
    return this.#name;
  }
  get query() {
    return this.#query;
  }
  get nodes() {
    return this.#nodes;
  }

  updateQuery(query: SDTFQuery, treeState: TreeState) {
    this.#query = query;
    this.refresh(treeState);
  }

  refresh(treeState: TreeState) {
    this.#nodes.clear();
    const results = makeRunQuery(treeState)(this.#query);
    for (const node of results) {
      if (node.isToken) {
        this.#nodes.tokens.add(node);
      } else if (node.isGroup) {
        this.#nodes.groups.add(node);
      } else if (node.isCollection) {
        this.#nodes.collections.add(node);
      }
    }
  }

  serialize(): SerializedView {
    return {
      name: this.#name,
      query: this.#query,
    };
  }
}
