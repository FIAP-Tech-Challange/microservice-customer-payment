export class BrazilianPhone {
  private readonly digits: string;

  constructor(rawPhone: string) {
    this.digits = BrazilianPhone.cleanAndValidate(rawPhone);
    Object.freeze(this);
  }

  private static cleanAndValidate(rawPhone: string): string {
    // Remove all non-digit characters
    const digitsOnly = rawPhone.replace(/\D/g, '');

    // Validate length and patterns
    const isValid =
      // Regular 11-digit format (DDD + number)
      /^(\d{2})(9\d{8})$/.test(digitsOnly) || // Mobile
      /^(\d{2})([2-5]\d{7})$/.test(digitsOnly) || // Landline
      // International 13-digit format (55 + DDD + number)
      /^55(\d{2})(9\d{8})$/.test(digitsOnly) || // Mobile
      /^55(\d{2})([2-5]\d{7})$/.test(digitsOnly); // Landline

    if (!isValid) {
      throw new Error('Invalid Brazilian phone number');
    }

    // Convert to full international format (55 + DDD + number)
    return digitsOnly.length === 11 ? `55${digitsOnly}` : digitsOnly;
  }

  // Format: +55 (11) 98765-4321
  public format(): string {
    const ddd = this.digits.substring(2, 4);
    const prefix = this.digits.substring(4, 9);
    const suffix = this.digits.substring(9);
    return `+55 (${ddd}) ${prefix}-${suffix}`;
  }

  // Raw digits with country code: 5511987654321
  public toString(): string {
    return this.digits;
  }

  // Check if mobile (has 9 after DDD)
  public isMobile(): boolean {
    return this.digits.charAt(4) === '9';
  }

  public equals(other: BrazilianPhone): boolean {
    return this.digits === other.digits;
  }
}
