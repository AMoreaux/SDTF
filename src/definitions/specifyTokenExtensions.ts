export const specifyCreatedAtTokenExtension = 'com.specifyapp.createdAt';
export const specifyUpdatedAtTokenExtension = 'com.specifyapp.updatedAt';
export const specifySourceIdTokenExtension = 'com.specifyapp.sourceId';

export type SpecifyTokenExtensions = {
  [specifyCreatedAtTokenExtension]?: string;
  [specifyUpdatedAtTokenExtension]?: string;
  [specifySourceIdTokenExtension]?: string;
};
