import { SDTFErrorKey } from './SDTFErrorKeys.js';

export class SDTFError extends Error {
  public readonly errorKey: SDTFErrorKey;
  public readonly originalError?: Error;
  constructor(errorKey: SDTFErrorKey, message: string, originalError?: Error) {
    super(message);
    this.errorKey = errorKey;
    this.originalError = originalError;
  }
  toString() {
    if (this.originalError) {
      /* v8 ignore start */
      return `${this.errorKey}: ${this.message} (Original error: ${this.originalError.message})`;
      /* v8 ignore stop */
    }
    return `${this.errorKey}: ${this.message}`;
  }
}
