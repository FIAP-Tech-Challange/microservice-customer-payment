import { CoreException } from './coreException';

export class ResourceInvalidException extends CoreException {
  static readonly CODE = 'RIE400';

  constructor(message: string) {
    super({
      code: ResourceInvalidException.CODE,
      message,
      shortMessage: 'Resource invalid',
    });
  }
}
