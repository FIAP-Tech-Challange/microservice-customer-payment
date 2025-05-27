export class CPF {
  private readonly digits: string;

  constructor(rawCpf: string) {
    this.digits = CPF.cleanAndValidate(rawCpf);
    Object.freeze(this);
  }

  private static cleanAndValidate(rawCpf: string): string {
    const digitsOnly = rawCpf.replace(/\D/g, '');
    if (!CPF.isValidCPF(digitsOnly)) {
      throw new Error('Invalid CPF');
    }
    return digitsOnly;
  }

  private static isValidCPF(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^([0-9])\1{10}$/.test(cpf)) {
      return false;
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let firstCheck = 11 - (sum % 11);
    if (firstCheck >= 10) firstCheck = 0;
    if (firstCheck !== parseInt(cpf.charAt(9))) {
      return false;
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let secondCheck = 11 - (sum % 11);
    if (secondCheck >= 10) secondCheck = 0;
    if (secondCheck !== parseInt(cpf.charAt(10))) {
      return false;
    }
    return true;
  }

  public format(): string {
    return this.digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public toString(): string {
    return this.digits;
  }

  public equals(other: CPF): boolean {
    return this.digits === other.digits;
  }
}
