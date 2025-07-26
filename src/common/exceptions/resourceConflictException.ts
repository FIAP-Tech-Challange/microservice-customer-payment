import { CoreException } from './coreException';

export class ResourceConflictException extends CoreException {
  static readonly CODE = 'RC409';

  constructor(message: string) {
    super({
      code: ResourceConflictException.CODE,
      message,
      shortMessage: 'Resource conflict',
    });
  }
}
