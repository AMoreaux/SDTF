import {
  SpecifyJSONArrayValue,
  SpecifyJSONBooleanValue,
  SpecifyJSONNullValue,
  SpecifyJSONNumberValue,
  SpecifyJSONObjectValue,
  SpecifyJSONStringValue,
} from '../../definitions/tokenTypes/_JSON.js';
import { makeRandomString, pickRandomNumberInRange } from '../../utils/mockGenerators.js';

export function getMockedJSONStringValue(
  override?: SpecifyJSONStringValue,
): SpecifyJSONStringValue {
  return override !== undefined ? override : makeRandomString();
}

export function getMockedJSONNumberValue(
  override?: SpecifyJSONNumberValue,
): SpecifyJSONNumberValue {
  return override !== undefined ? override : pickRandomNumberInRange(-1000, 1000, 0.1);
}

export function getMockedJSONBooleanValue(
  override?: SpecifyJSONBooleanValue,
): SpecifyJSONBooleanValue {
  return override !== undefined ? override : !!Math.round(Math.random());
}

export function getMockedJSONNullValue(): SpecifyJSONNullValue {
  return null;
}

export function getMockedJSONArrayValue(override?: SpecifyJSONArrayValue): SpecifyJSONArrayValue {
  return override !== undefined
    ? override
    : [
        pickRandomNumberInRange(-100, 100, 0.1),
        makeRandomString(),
        !!Math.round(Math.random()),
        null,
        new Array(pickRandomNumberInRange(1, 4))
          .fill(null)
          .map(() => pickRandomNumberInRange(-100, 100, 0.1)),
        { a: 1, b: '2', c: true },
      ];
}

export function getMockedJSONObjectValue(
  override?: SpecifyJSONObjectValue,
): SpecifyJSONObjectValue {
  return override !== undefined
    ? override
    : {
        a: 1,
        b: '2',
        c: true,
        d: null,
        e: new Array(pickRandomNumberInRange(1, 4))
          .fill(null)
          .map(() => pickRandomNumberInRange(-100, 100, 0.1)),
        f: { a: 1, b: '2', c: true },
      };
}
