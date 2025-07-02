import { CoreException } from './coreException';

export class UnexpectedError extends CoreException {
  static readonly CODE = 'UERR';

  constructor(message: string) {
    super({
      code: UnexpectedError.CODE,
      message,
      shortMessage: 'Unexpected error occurred',
    });
  }
}
