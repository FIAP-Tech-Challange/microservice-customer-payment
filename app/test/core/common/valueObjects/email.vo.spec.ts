import { Email } from 'src/core/common/valueObjects/email.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('Email Value Object', () => {
  describe('create', () => {
    describe('valid email addresses', () => {
      it('should create a valid email with standard format', () => {
        const result = Email.create('test@example.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('test@example.com');
      });

      it('should create a valid email and normalize to lowercase', () => {
        const result = Email.create('Test.User@Example.COM');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('test.user@example.com');
      });

      it('should create a valid email and trim whitespace', () => {
        const result = Email.create('   user@domain.com   ');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user@domain.com');
      });

      it('should create a valid email with subdomain', () => {
        const result = Email.create('user@mail.example.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user@mail.example.com');
      });

      it('should create a valid email with dots in local part', () => {
        const result = Email.create('first.last@example.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('first.last@example.com');
      });

      it('should create a valid email with numbers', () => {
        const result = Email.create('user123@example123.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user123@example123.com');
      });

      it('should create a valid email with hyphens in domain', () => {
        const result = Email.create('user@my-domain.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user@my-domain.com');
      });

      it('should create a valid email with plus sign', () => {
        const result = Email.create('user+tag@example.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user+tag@example.com');
      });

      it('should create a valid email with underscores', () => {
        const result = Email.create('user_name@example.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user_name@example.com');
      });

      it('should create a valid email with quoted local part', () => {
        const result = Email.create('"test.email"@example.com');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('"test.email"@example.com');
      });

      it('should create a valid email with IP address domain', () => {
        const result = Email.create('user@[192.168.1.1]');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(Email);
        expect(result.value!.toString()).toBe('user@[192.168.1.1]');
      });
    });

    describe('invalid email addresses', () => {
      it('should return error for email missing @ symbol', () => {
        const result = Email.create('invalid.email.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for email missing domain', () => {
        const result = Email.create('user@');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for email missing local part', () => {
        const result = Email.create('@domain.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for empty string', () => {
        const result = Email.create('');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for whitespace-only string', () => {
        const result = Email.create('   ');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for multiple @ symbols', () => {
        const result = Email.create('user@@domain.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for domain without TLD', () => {
        const result = Email.create('user@domain');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for invalid characters in local part', () => {
        const result = Email.create('user<>@domain.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for invalid characters in domain', () => {
        const result = Email.create('user@domain<>.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for consecutive dots in local part', () => {
        const result = Email.create('user..name@domain.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for starting dot in local part', () => {
        const result = Email.create('.user@domain.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for ending dot in local part', () => {
        const result = Email.create('user.@domain.com');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });

      it('should return error for TLD too short', () => {
        const result = Email.create('user@domain.c');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid email address');
      });
    });
  });

  describe('toString', () => {
    it('should return normalized email address', () => {
      const result = Email.create('Test.User@Example.COM');
      const email = result.value!;

      expect(email.toString()).toBe('test.user@example.com');
    });

    it('should return trimmed email address', () => {
      const result = Email.create('   user@domain.com   ');
      const email = result.value!;

      expect(email.toString()).toBe('user@domain.com');
    });
  });

  describe('equals', () => {
    it('should return true for equivalent email addresses with different casing', () => {
      const email1Result = Email.create('user@domain.com');
      const email2Result = Email.create('USER@DOMAIN.COM');
      const email3Result = Email.create('User@Domain.Com');

      const email1 = email1Result.value!;
      const email2 = email2Result.value!;
      const email3 = email3Result.value!;

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(true);
      expect(email2.equals(email3)).toBe(true);
    });

    it('should return true for equivalent email addresses with different whitespace', () => {
      const email1Result = Email.create('user@domain.com');
      const email2Result = Email.create('   user@domain.com   ');

      const email1 = email1Result.value!;
      const email2 = email2Result.value!;

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different email addresses', () => {
      const email1Result = Email.create('user@domain.com');
      const email2Result = Email.create('other@domain.com');

      const email1 = email1Result.value!;
      const email2 = email2Result.value!;

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return false for same local part but different domain', () => {
      const email1Result = Email.create('user@domain1.com');
      const email2Result = Email.create('user@domain2.com');

      const email1 = email1Result.value!;
      const email2 = email2Result.value!;

      expect(email1.equals(email2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen and immutable', () => {
      const result = Email.create('test@example.com');
      const email = result.value!;

      expect(Object.isFrozen(email)).toBe(true);

      // Attempting to modify should throw
      expect(() => {
        (email as any).value = 'modified';
      }).toThrow();

      // Value should remain unchanged
      expect(email.toString()).toBe('test@example.com');
    });
  });

  describe('email normalization', () => {
    it('should normalize mixed case emails consistently', () => {
      const testCases = [
        { input: 'Test@Example.com', expected: 'test@example.com' },
        { input: 'USER@DOMAIN.COM', expected: 'user@domain.com' },
        { input: 'MiXeD.CaSe@DoMaIn.OrG', expected: 'mixed.case@domain.org' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = Email.create(input);
        expect(result.error).toBeUndefined();
        expect(result.value!.toString()).toBe(expected);
      });
    });

    it('should trim whitespace consistently', () => {
      const testCases = [
        { input: '  test@example.com  ', expected: 'test@example.com' },
        { input: '\t\nuser@domain.com\t\n', expected: 'user@domain.com' },
        { input: ' \r\n email@test.org \r\n ', expected: 'email@test.org' },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = Email.create(input);
        expect(result.error).toBeUndefined();
        expect(result.value!.toString()).toBe(expected);
      });
    });
  });
});
