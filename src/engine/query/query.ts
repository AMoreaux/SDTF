import { CollectionWhere } from './definitions/collectionWhere.js';
import { GroupWhere } from './definitions/groupWhere.js';
import { TokenWhere } from './definitions/tokenWhere.js';

export type WhereNode = GroupWhere | CollectionWhere | TokenWhere;

export type SDTFQuery = {
  where: WhereNode | Array<WhereNode>;
};
