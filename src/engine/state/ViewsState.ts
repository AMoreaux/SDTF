import { SDTFError } from '../../errors/index.js';
import { makeRunQuery, SDTFQuery } from '../query/index.js';
import { TreeState } from './TreeState.js';
import { ViewState } from './ViewState.js';

export class ViewsState {
  readonly #viewsMap = new Map<string, ViewState>();

  /**
   * Register a new view to the state
   * @param name
   * @param query
   * @param treeState
   */
  register(name: string, query: SDTFQuery, treeState: TreeState) {
    if (this.#viewsMap.has(name)) {
      throw new SDTFError('SDTF_VIEW_ALREADY_EXISTS', `View "${name}" already exists.`);
    }
    const viewState = new ViewState(name, query);
    viewState.refresh(treeState);

    this.#viewsMap.set(name, viewState);
  }

  /**
   * Update a view in the state based on its name
   * @param name
   * @param query
   * @param treeState
   */
  updateQuery(name: string, query: SDTFQuery, treeState: TreeState) {
    const viewState = this.#viewsMap.get(name);
    if (!viewState) {
      throw new SDTFError('SDTF_VIEW_NOT_FOUND', `View "${name}" does not exist.`);
    }
    viewState.updateQuery(query, treeState);
  }

  /**
   * Update all views for the tree state
   * @param treeState
   */
  updateAll(treeState: TreeState) {
    this.#viewsMap.forEach(viewState => {
      viewState.refresh(treeState);
    });
  }

  /**
   * Delete a view from the state based on its name
   * @param name
   */
  delete(name: string) {
    return this.#viewsMap.delete(name);
  }

  /**
   * @internal
   * @param name
   */
  has(name: string) {
    return this.#viewsMap.has(name);
  }

  /**
   * @internal
   * @param name
   */
  get(name: string) {
    return this.#viewsMap.get(name);
  }

  /**
   * @internal
   * @param callback
   */
  forEach(callback: (viewState: ViewState, name: string) => void) {
    for (const [name, viewState] of this.#viewsMap.entries()) {
      callback(viewState, name);
    }
  }

  /**
   * @internal
   */
  values() {
    return Array.from(this.#viewsMap.values());
  }

  /**
   * Delete all views from the state
   */
  clear() {
    this.#viewsMap.clear();
  }

  serialize() {
    return Array.from(this.#viewsMap.values()).map(viewState => viewState.serialize());
  }
}
