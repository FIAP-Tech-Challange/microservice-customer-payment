export class CoreException extends Error {
  code: string;
  message: string;
  shortMessage: string;

  constructor(params: { code: string; message: string; shortMessage: string }) {
    super(params.message);

    if (this.constructor === CoreException) {
      throw new Error(
        'CoreException is an abstract class and cannot be instantiated directly.',
      );
    }

    this.code = params.code;
    this.message = params.message;
    this.shortMessage = params.shortMessage;
  }
}
