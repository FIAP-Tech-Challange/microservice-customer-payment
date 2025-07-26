import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    const normalized = email.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new ResourceInvalidException('Invalid email address');
    }
    this.value = normalized;
    Object.freeze(this);
  }

  public static create(email: string): CoreResponse<Email> {
    try {
      const emailInstance = new Email(email);

      return { value: emailInstance, error: undefined };
    } catch (error) {
      return {
        error: error as ResourceInvalidException,
        value: undefined,
      };
    }
  }

  private static isValid(email: string): boolean {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
