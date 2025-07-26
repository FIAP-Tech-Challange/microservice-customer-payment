import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('BrazilianPhone Value Object', () => {
  describe('create', () => {
    describe('valid phone numbers', () => {
      it('should create a valid mobile phone (local format with formatting)', () => {
        const result = BrazilianPhone.create('11 91234-5678');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('5511912345678');
        expect(result.value!.format()).toBe('+55 (11) 91234-5678');
      });

      it('should create a valid mobile phone (local format without formatting)', () => {
        const result = BrazilianPhone.create('11912345678');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('5511912345678');
        expect(result.value!.format()).toBe('+55 (11) 91234-5678');
      });

      it('should create a valid landline phone (local format with formatting)', () => {
        const result = BrazilianPhone.create('21 2345-6789');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('552123456789');
        expect(result.value!.format()).toBe('+55 (21) 23456-789');
      });

      it('should create a valid landline phone (local format without formatting)', () => {
        const result = BrazilianPhone.create('2123456789');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('552123456789');
        expect(result.value!.format()).toBe('+55 (21) 23456-789');
      });

      it('should create a valid mobile phone (international format)', () => {
        const result = BrazilianPhone.create('+55 11 91234-5678');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('5511912345678');
        expect(result.value!.format()).toBe('+55 (11) 91234-5678');
      });

      it('should create a valid landline phone (international format)', () => {
        const result = BrazilianPhone.create('+55 21 2345-6789');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('552123456789');
        expect(result.value!.format()).toBe('+55 (21) 23456-789');
      });

      it('should create a valid mobile phone (international format without formatting)', () => {
        const result = BrazilianPhone.create('5511912345678');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('5511912345678');
        expect(result.value!.format()).toBe('+55 (11) 91234-5678');
      });

      it('should create a valid landline phone (international format without formatting)', () => {
        const result = BrazilianPhone.create('552123456789');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('552123456789');
        expect(result.value!.format()).toBe('+55 (21) 23456-789');
      });

      it('should handle phone numbers with various formatting characters', () => {
        const result = BrazilianPhone.create('(11) 9.1234-5678');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('5511912345678');
        expect(result.value!.format()).toBe('+55 (11) 91234-5678');
      });

      it('should handle phone numbers with spaces and parentheses', () => {
        const result = BrazilianPhone.create(' +55 (11) 91234-5678 ');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(BrazilianPhone);
        expect(result.value!.toString()).toBe('5511912345678');
        expect(result.value!.format()).toBe('+55 (11) 91234-5678');
      });
    });

    describe('invalid phone numbers', () => {
      it('should return error for phone number too short', () => {
        const result = BrazilianPhone.create('11 9123-456');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for phone number too long', () => {
        const result = BrazilianPhone.create('11 91234-56789');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for invalid DDD (area code)', () => {
        const result = BrazilianPhone.create('1 91234-5678');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for invalid mobile number (not starting with 9)', () => {
        const result = BrazilianPhone.create('11 81234-5678');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for invalid landline number (starting with 9)', () => {
        const result = BrazilianPhone.create('11 9234-5678');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for landline with invalid first digit', () => {
        const result = BrazilianPhone.create('11 1234-5678');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for empty string', () => {
        const result = BrazilianPhone.create('');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });

      it('should return error for non-numeric characters only', () => {
        const result = BrazilianPhone.create('abc-def-ghij');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid Brazilian phone number');
      });
    });
  });

  describe('format', () => {
    it('should format mobile phone correctly', () => {
      const result = BrazilianPhone.create('11912345678');
      const phone = result.value!;

      expect(phone.format()).toBe('+55 (11) 91234-5678');
    });

    it('should format landline phone correctly', () => {
      const result = BrazilianPhone.create('2123456789');
      const phone = result.value!;

      expect(phone.format()).toBe('+55 (21) 23456-789');
    });
  });

  describe('toString', () => {
    it('should return normalized digits for mobile phone', () => {
      const result = BrazilianPhone.create('11 91234-5678');
      const phone = result.value!;

      expect(phone.toString()).toBe('5511912345678');
    });

    it('should return normalized digits for landline phone', () => {
      const result = BrazilianPhone.create('21 2345-6789');
      const phone = result.value!;

      expect(phone.toString()).toBe('552123456789');
    });
  });

  describe('equals', () => {
    it('should return true for equivalent phone numbers with different formatting', () => {
      const phone1Result = BrazilianPhone.create('11 91234-5678');
      const phone2Result = BrazilianPhone.create('+55 11 91234-5678');
      const phone3Result = BrazilianPhone.create('5511912345678');

      const phone1 = phone1Result.value!;
      const phone2 = phone2Result.value!;
      const phone3 = phone3Result.value!;

      expect(phone1.equals(phone2)).toBe(true);
      expect(phone1.equals(phone3)).toBe(true);
      expect(phone2.equals(phone3)).toBe(true);
    });

    it('should return false for different phone numbers', () => {
      const phone1Result = BrazilianPhone.create('11 91234-5678');
      const phone2Result = BrazilianPhone.create('21 2345-6789');

      const phone1 = phone1Result.value!;
      const phone2 = phone2Result.value!;

      expect(phone1.equals(phone2)).toBe(false);
    });

    it('should return false for mobile vs landline with same DDD', () => {
      const mobileResult = BrazilianPhone.create('11 91234-5678');
      const landlineResult = BrazilianPhone.create('11 2345-6789');

      const mobile = mobileResult.value!;
      const landline = landlineResult.value!;

      expect(mobile.equals(landline)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen and immutable', () => {
      const result = BrazilianPhone.create('11912345678');
      const phone = result.value!;

      expect(Object.isFrozen(phone)).toBe(true);

      // Attempting to modify should throw
      expect(() => {
        (phone as any).digits = 'modified';
      }).toThrow();

      // Value should remain unchanged
      expect(phone.toString()).toBe('5511912345678');
    });
  });
});
