import { BrazilianPhone } from './brazilian-phone.vo';

describe('BrazilianPhone Value Object', () => {
  it('should create a valid mobile phone (local format)', () => {
    const phone = new BrazilianPhone('11 91234-5678');
    expect(phone.toString()).toBe('5511912345678');
    expect(phone.format()).toBe('+55 (11) 91234-5678');
  });

  it('should create a valid landline phone (local format)', () => {
    const phone = new BrazilianPhone('21 2345-6789');
    expect(phone.toString()).toBe('552123456789');
    expect(phone.format()).toBe('+55 (21) 23456-789');
  });

  it('should create a valid mobile phone (international format)', () => {
    const phone = new BrazilianPhone('+55 11 91234-5678');
    expect(phone.toString()).toBe('5511912345678');
    expect(phone.format()).toBe('+55 (11) 91234-5678');
  });

  it('should create a valid landline phone with only digits', () => {
    const phone = new BrazilianPhone('552123456789');
    expect(phone.toString()).toBe('552123456789');
    expect(phone.format()).toBe('+55 (21) 23456-789');
  });

  it('should create a valid mobile phone with only digits', () => {
    const phone = new BrazilianPhone('5511912345678');
    expect(phone.toString()).toBe('5511912345678');
    expect(phone.format()).toBe('+55 (11) 91234-5678');
  });

  it('should throw error for invalid phone (too short)', () => {
    expect(() => new BrazilianPhone('11 9123-456')).toThrow(
      'Invalid Brazilian phone number',
    );
  });

  it('should throw error for invalid phone (invalid DDD)', () => {
    expect(() => new BrazilianPhone('1 91234-5678')).toThrow(
      'Invalid Brazilian phone number',
    );
  });

  it('should compare equality correctly', () => {
    const phone1 = new BrazilianPhone('11 91234-5678');
    const phone2 = new BrazilianPhone('+55 11 91234-5678');
    const phone3 = new BrazilianPhone('21 2345-6789');
    expect(phone1.equals(phone2)).toBe(true);
    expect(phone1.equals(phone3)).toBe(false);
  });
});
