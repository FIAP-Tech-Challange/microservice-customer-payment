import { CoreException } from '../exceptions/coreException';

export type CoreResponse<T> =
  | {
      value: T;
      error: undefined;
    }
  | {
      value: undefined;
      error: CoreException;
    };
