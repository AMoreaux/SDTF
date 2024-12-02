import { SDTFError } from '../../../errors/index.js';

export function checkForTokenModesInCollection(
  tokenStringPath: string,
  tokenModes: Array<string> | null,
  collectionStringPath: string,
  collectionAllowedModes: Array<string>,
) {
  if (tokenModes === null) {
    // We cannot validate unresolvable top level alias modes
    throw new SDTFError(
      'SDTF_TOKEN_MODE_MISMATCH',
      `Modes of token "${tokenStringPath}" cannot be computed since it points to an unresolvable token but is used in the collection "${collectionStringPath}" defining modes "${collectionAllowedModes.join(
        ', ',
      )}".`,
    );
  }
  const longerModes =
    tokenModes.length > collectionAllowedModes.length ? tokenModes : collectionAllowedModes;
  const shorterModes =
    tokenModes.length > collectionAllowedModes.length ? collectionAllowedModes : tokenModes;

  if (!longerModes.every(allowedMode => shorterModes.includes(allowedMode))) {
    throw new SDTFError(
      'SDTF_TOKEN_MODE_MISMATCH',
      `Token "${tokenStringPath}" has modes "${tokenModes.join(
        ', ',
      )}" but is used in the collection "${collectionStringPath}" defining modes "${collectionAllowedModes.join(
        ', ',
      )}".`,
    );
  }
}
