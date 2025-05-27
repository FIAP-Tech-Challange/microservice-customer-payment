export class Email {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new Error('Invalid email address');
    }
    this.value = normalized;
    Object.freeze(this);
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
