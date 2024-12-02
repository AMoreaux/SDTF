import { z } from 'zod';

export const collectionKindSchema = z.literal('collection');
export type CollectionKind = 'collection';

export const groupKindSchema = z.literal('group');
export type GroupKind = 'group';

export const tokenKindSchema = z.literal('token');
export type TokenKind = 'token';

export const nodeKindSchema = z.union([collectionKindSchema, groupKindSchema, tokenKindSchema]);
export type NodeKind = CollectionKind | GroupKind | TokenKind;
