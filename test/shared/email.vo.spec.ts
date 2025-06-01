import { Email } from '../../src/shared/domain/email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('Test.User@Example.com');
    expect(email.toString()).toBe('test.user@example.com');
  });

  it('should trim and lowercase the email', () => {
    const email = new Email('   USER@DOMAIN.COM   ');
    expect(email.toString()).toBe('user@domain.com');
  });

  it('should throw error for invalid email (missing @)', () => {
    expect(() => new Email('invalid.email.com')).toThrow(
      'Invalid email address',
    );
  });

  it('should throw error for invalid email (missing domain)', () => {
    expect(() => new Email('user@')).toThrow('Invalid email address');
  });

  it('should throw error for invalid email (empty string)', () => {
    expect(() => new Email('')).toThrow('Invalid email address');
  });

  it('should compare equality correctly', () => {
    const email1 = new Email('user@domain.com');
    const email2 = new Email('USER@DOMAIN.COM');
    const email3 = new Email('other@domain.com');
    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});
