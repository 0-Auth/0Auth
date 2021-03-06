import {
  AuthType,
  Predicate,
  Property,
  propertyObject,
  Signature,
} from '@0auth/message';

import { SubmitInfo, PublicKey } from '../type';
import { verifyByAuthType } from '@0auth/server';

export function verifyProperty<T>(
  properties: Property[],
  sign: Signature,
  publicKey: PublicKey,
  mode: AuthType,
): SubmitInfo<T> {
  let isPassed = verifyByAuthType(properties, sign, publicKey, mode);
  const propertiesObj = propertyObject(properties);
  return {
    validate(key: string, func: Predicate<unknown>): SubmitInfo<T> {
      if (!func(propertiesObj[key])) {
        isPassed = false;
      }
      return this;
    },
    confirm(response: T): T | null {
      if (!isPassed) {
        return null;
      }
      return response;
    },
    supply(supplier: () => T): T | null {
      if (!isPassed) {
        return null;
      }
      return supplier();
    },
  };
}
