import { validateCPF } from '../../../../src/modules/customers/utils/cpf-validator';

describe('CPF Validator', () => {
  it('should return true for valid CPFs with formatting', () => {
    expect(validateCPF('902.136.910-94')).toBe(true);
    expect(validateCPF('203.756.670-08')).toBe(true);
    expect(validateCPF('136.910.280-12')).toBe(true);
    expect(validateCPF('905.729.650-01')).toBe(true);
    expect(validateCPF('025.148.430-06')).toBe(true);
  });

  it('should return true for valid CPFs without formatting', () => {
    expect(validateCPF('90213691094')).toBe(true);
    expect(validateCPF('20375667008')).toBe(true);
    expect(validateCPF('13691028012')).toBe(true);
    expect(validateCPF('90572965001')).toBe(true);
    expect(validateCPF('02514843006')).toBe(true);
  });

  it('should return false for invalid CPFs', () => {
    expect(validateCPF('000.000.000-00')).toBe(false);
    expect(validateCPF('123.456.789-10')).toBe(false);
    expect(validateCPF('111.111.111-11')).toBe(false);
    expect(validateCPF('123.456.789-00')).toBe(false);
  });

  it('should return false for CPFs with incorrect length', () => {
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF('1234567890123')).toBe(false);
    expect(validateCPF('')).toBe(false);
  });

  it('should return false for non-numeric CPFs', () => {
    expect(validateCPF('abc.def.ghi-jk')).toBe(false);
    expect(validateCPF('abc123def456')).toBe(false);
  });
});
