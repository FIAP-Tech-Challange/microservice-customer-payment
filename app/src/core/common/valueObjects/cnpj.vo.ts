import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

export class CNPJ {
  private readonly value: string;

  private constructor(cnpj: string) {
    const cleanedCNPJ = this.clean(cnpj);

    if (!this.isValid(cleanedCNPJ)) {
      throw new ResourceInvalidException('Invalid CNPJ');
    }

    this.value = cleanedCNPJ;
    Object.freeze(this);
  }

  public static create(cnpj: string): CoreResponse<CNPJ> {
    try {
      const cnpjInstance = new CNPJ(cnpj);

      return { value: cnpjInstance, error: undefined };
    } catch (error) {
      return {
        error: error as ResourceInvalidException,
        value: undefined,
      };
    }
  }

  private clean(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  private isValid(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
      return false;
    }

    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const remainder1 = sum % 11;
    const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;

    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    const remainder2 = sum % 11;
    const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;

    return parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2;
  }

  public format(): string {
    return this.value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  public equals(other: CNPJ): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
