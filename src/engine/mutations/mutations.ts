// unused by runtime, but used by TS
import { z } from 'zod';

import { MutationDefinition } from './createMutationDefinition.js';
import { UnionToIntersection } from '../../utils/typeUtils.js';

import {
  resetTokenTreeMutationDefinition,
  loadTokenTreeMutationDefinition,
  registerViewMutationDefinition,
  updateViewMutationDefinition,
  setActiveViewMutationDefinition,
  deleteViewMutationDefinition,
  deleteAllViewsMutationDefinition,
  addCollectionMutationDefinition,
  addGroupMutationDefinition,
  addTokenMutationDefinition,
  createTokenModeValueMutationDefinition,
  deleteCollectionMutationDefinition,
  deleteGroupMutationDefinition,
  deleteTokenModeValueMutationDefinition,
  deleteTokenMutationDefinition,
  renameCollectionModeMutationDefinition,
  renameCollectionMutationDefinition,
  renameGroupMutationDefinition,
  renameTokenModeMutationDefinition,
  renameTokenMutationDefinition,
  truncateCollectionMutationDefinition,
  truncateGroupMutationDefinition,
  updateCollectionDescriptionMutationDefinition,
  updateCollectionExtensionsMutationDefinition,
  updateGroupDescriptionMutationDefinition,
  updateGroupExtensionsMutationDefinition,
  updateTokenDescriptionMutationDefinition,
  updateTokenExtensionsMutationDefinition,
  updateTokenModeValueMutationDefinition,
  updateTokenValueMutationDefinition,
  deleteCollectionModeMutationDefinition,
  resolveTokenValueAliasesMutationDefinition,
} from './definitions.js';
import { SDTFError } from '../../errors/index.js';

const SDTFMutations = [
  resetTokenTreeMutationDefinition,
  loadTokenTreeMutationDefinition,
  registerViewMutationDefinition,
  updateViewMutationDefinition,
  setActiveViewMutationDefinition,
  deleteViewMutationDefinition,
  deleteAllViewsMutationDefinition,
  addCollectionMutationDefinition,
  renameCollectionMutationDefinition,
  updateCollectionDescriptionMutationDefinition,
  updateCollectionExtensionsMutationDefinition,
  renameCollectionModeMutationDefinition,
  truncateCollectionMutationDefinition,
  deleteCollectionMutationDefinition,
  deleteCollectionModeMutationDefinition,
  addGroupMutationDefinition,
  renameGroupMutationDefinition,
  updateGroupDescriptionMutationDefinition,
  updateGroupExtensionsMutationDefinition,
  truncateGroupMutationDefinition,
  deleteGroupMutationDefinition,
  addTokenMutationDefinition,
  renameTokenMutationDefinition,
  updateTokenDescriptionMutationDefinition,
  updateTokenExtensionsMutationDefinition,
  updateTokenValueMutationDefinition,
  resolveTokenValueAliasesMutationDefinition,
  updateTokenModeValueMutationDefinition,
  renameTokenModeMutationDefinition,
  createTokenModeValueMutationDefinition,
  deleteTokenModeValueMutationDefinition,
  deleteTokenMutationDefinition,
] as const;

type SDTFMutationsTuple = typeof SDTFMutations;

export type SDTFMutation = SDTFMutationsTuple[number];

export type SDTFMutationName = SDTFMutation['name'];

export type PickSDTFMutation<MutationName extends SDTFMutation['name']> = Extract<
  SDTFMutation,
  { name: MutationName }
>;

type DistributeMutationsOverMappedObjects<T> = T extends MutationDefinition<
  infer Name,
  infer Schema
>
  ? { [k in Name]: T }
  : never;

export type SDTFMutationsMap = UnionToIntersection<
  DistributeMutationsOverMappedObjects<SDTFMutation>
>;

const sdtfMutationsMap = SDTFMutations.reduce((acc, mutation) => {
  // @ts-expect-error
  acc[mutation.name] = mutation;
  return acc;
}, {} as SDTFMutationsMap);

export function getSDTFMutationDefinition<N extends SDTFMutationName>(
  name: N,
): SDTFMutationsMap[N] {
  const maybeResult = sdtfMutationsMap[name];
  if (maybeResult === undefined) {
    throw new SDTFError(
      'SDTF_INTERNAL_DESIGN_ERROR',
      `No mutation definition found with name: "${name}"`,
    );
  }
  return maybeResult;
}
