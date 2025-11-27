import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

export class BrazilianPhone {
  private readonly digits: string;

  private constructor(rawPhone: string) {
    this.digits = BrazilianPhone.cleanAndValidate(rawPhone);
    Object.freeze(this);
  }

  public static create(phone: string): CoreResponse<BrazilianPhone> {
    try {
      const phoneInstance = new BrazilianPhone(phone);

      return { value: phoneInstance, error: undefined };
    } catch (error) {
      return {
        error: error as ResourceInvalidException,
        value: undefined,
      };
    }
  }

  private static cleanAndValidate(rawPhone: string): string {
    const digitsOnly = rawPhone.replace(/\D/g, '');

    const isValid =
      // Regular 11-digit format (DDD + number)
      /^(\d{2})(9\d{8})$/.test(digitsOnly) || // Mobile
      /^(\d{2})([2-5]\d{7})$/.test(digitsOnly) || // Landline
      // International 13-digit format (55 + DDD + number)
      /^55(\d{2})(9\d{8})$/.test(digitsOnly) || // Mobile
      /^55(\d{2})([2-5]\d{7})$/.test(digitsOnly); // Landline

    if (!isValid) {
      throw new ResourceInvalidException('Invalid Brazilian phone number');
    }

    if (digitsOnly.length === 11 || digitsOnly.length === 10) {
      return `55${digitsOnly}`;
    }
    return digitsOnly;
  }

  public format(): string {
    const ddd = this.digits.substring(2, 4);
    const prefix = this.digits.substring(4, 9);
    const suffix = this.digits.substring(9);
    return `+55 (${ddd}) ${prefix}-${suffix}`;
  }

  public toString(): string {
    return this.digits;
  }

  public equals(other: BrazilianPhone): boolean {
    return this.digits === other.digits;
  }
}
