import { CoreException } from '../exceptions/coreException';

export type CoreResponse<T> = [CoreException, undefined] | [undefined, T];
