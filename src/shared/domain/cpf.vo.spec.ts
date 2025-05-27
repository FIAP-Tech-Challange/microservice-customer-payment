import { CPF } from './cpf.vo';

describe('CPF Value Object', () => {
  it('should create a valid CPF', () => {
    const cpf = new CPF('529.982.247-25');
    expect(cpf.toString()).toBe('52998224725');
    expect(cpf.format()).toBe('529.982.247-25');
  });

  it('should create a valid CPF with only digits', () => {
    const cpf = new CPF('52998224725');
    expect(cpf.toString()).toBe('52998224725');
    expect(cpf.format()).toBe('529.982.247-25');
  });

  it('should throw error for invalid CPF (wrong check digits)', () => {
    expect(() => new CPF('529.982.247-26')).toThrow('Invalid CPF');
  });

  it('should throw error for invalid CPF (all digits equal)', () => {
    expect(() => new CPF('111.111.111-11')).toThrow('Invalid CPF');
  });

  it('should throw error for invalid CPF (too short)', () => {
    expect(() => new CPF('123.456.789-0')).toThrow('Invalid CPF');
  });

  it('should compare equality correctly', () => {
    const cpf1 = new CPF('529.982.247-25');
    const cpf2 = new CPF('52998224725');
    const cpf3 = new CPF('123.456.789-09');
    expect(cpf1.equals(cpf2)).toBe(true);
    expect(cpf1.equals(cpf3)).toBe(false);
  });
});
