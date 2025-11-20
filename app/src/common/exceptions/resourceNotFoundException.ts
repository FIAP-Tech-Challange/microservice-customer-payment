import { CoreException } from './coreException';

export class ResourceNotFoundException extends CoreException {
  static readonly CODE = 'NF404';

  constructor(message: string) {
    super({
      code: ResourceNotFoundException.CODE,
      message,
      shortMessage: 'Resource not found',
    });
  }
}
