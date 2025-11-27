import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('CNPJ Value Object', () => {
  describe('create', () => {
    describe('valid CNPJ numbers', () => {
      it('should create a valid CNPJ with formatting', () => {
        const result = CNPJ.create('11.222.333/0001-81');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
        expect(result.value!.toString()).toBe('11222333000181');
        expect(result.value!.format()).toBe('11.222.333/0001-81');
      });

      it('should create a valid CNPJ without formatting', () => {
        const result = CNPJ.create('11222333000181');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
        expect(result.value!.toString()).toBe('11222333000181');
        expect(result.value!.format()).toBe('11.222.333/0001-81');
      });

      it('should create a valid CNPJ with partial formatting', () => {
        const result = CNPJ.create('11222333/0001-81');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
        expect(result.value!.toString()).toBe('11222333000181');
        expect(result.value!.format()).toBe('11.222.333/0001-81');
      });

      it('should create a valid CNPJ with mixed formatting characters', () => {
        const result = CNPJ.create('11.222.333-0001/81');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
        expect(result.value!.toString()).toBe('11222333000181');
        expect(result.value!.format()).toBe('11.222.333/0001-81');
      });

      it('should create a valid CNPJ with spaces', () => {
        const result = CNPJ.create(' 11 222 333 0001 81 ');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
        expect(result.value!.toString()).toBe('11222333000181');
        expect(result.value!.format()).toBe('11.222.333/0001-81');
      });

      it('should create another valid CNPJ', () => {
        const result = CNPJ.create('07.255.866/0001-92');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
        expect(result.value!.toString()).toBe('07255866000192');
        expect(result.value!.format()).toBe('07.255.866/0001-92');
      });
    });

    describe('invalid CNPJ numbers', () => {
      it('should return error for CNPJ with wrong check digits', () => {
        const result = CNPJ.create('11.222.333/0001-82');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for CNPJ with all same digits', () => {
        const result = CNPJ.create('11.111.111/1111-11');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for CNPJ too short', () => {
        const result = CNPJ.create('11.222.333/0001-8');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for CNPJ too long', () => {
        const result = CNPJ.create('11.222.333/0001-811');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for empty string', () => {
        const result = CNPJ.create('');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for non-numeric characters only', () => {
        const result = CNPJ.create('abc.def.ghi/jklm-no');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for CNPJ with invalid first check digit', () => {
        const result = CNPJ.create('11.222.333/0001-91');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for CNPJ with invalid second check digit', () => {
        const result = CNPJ.create('11.222.333/0001-89');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });

      it('should return error for whitespace-only string', () => {
        const result = CNPJ.create('   ');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });
    });
  });

  describe('format', () => {
    it('should format CNPJ correctly', () => {
      const result = CNPJ.create('11222333000181');
      const cnpj = result.value!;

      expect(cnpj.format()).toBe('11.222.333/0001-81');
    });

    it('should format another CNPJ correctly', () => {
      const result = CNPJ.create('07255866000192');
      const cnpj = result.value!;

      expect(cnpj.format()).toBe('07.255.866/0001-92');
    });
  });

  describe('toString', () => {
    it('should return clean digits', () => {
      const result = CNPJ.create('11.222.333/0001-81');
      const cnpj = result.value!;

      expect(cnpj.toString()).toBe('11222333000181');
    });

    it('should return clean digits for unformatted input', () => {
      const result = CNPJ.create('11222333000181');
      const cnpj = result.value!;

      expect(cnpj.toString()).toBe('11222333000181');
    });
  });

  describe('equals', () => {
    it('should return true for equivalent CNPJ numbers with different formatting', () => {
      const cnpj1Result = CNPJ.create('11.222.333/0001-81');
      const cnpj2Result = CNPJ.create('11222333000181');
      const cnpj3Result = CNPJ.create('11222333/0001-81');

      const cnpj1 = cnpj1Result.value!;
      const cnpj2 = cnpj2Result.value!;
      const cnpj3 = cnpj3Result.value!;

      expect(cnpj1.equals(cnpj2)).toBe(true);
      expect(cnpj1.equals(cnpj3)).toBe(true);
      expect(cnpj2.equals(cnpj3)).toBe(true);
    });

    it('should return false for different CNPJ numbers', () => {
      const cnpj1Result = CNPJ.create('11.222.333/0001-81');
      const cnpj2Result = CNPJ.create('07.255.866/0001-92');

      const cnpj1 = cnpj1Result.value!;
      const cnpj2 = cnpj2Result.value!;

      expect(cnpj1.equals(cnpj2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen and immutable', () => {
      const result = CNPJ.create('11222333000181');
      const cnpj = result.value!;

      expect(Object.isFrozen(cnpj)).toBe(true);

      // Attempting to modify should throw
      expect(() => {
        (cnpj as any).value = 'modified';
      }).toThrow();

      // Value should remain unchanged
      expect(cnpj.toString()).toBe('11222333000181');
    });
  });

  describe('CNPJ validation algorithm', () => {
    it('should validate check digits correctly for various valid CNPJs', () => {
      const validCNPJs = [
        '11.222.333/0001-81',
        '07.255.866/0001-92',
        '12.345.678/0001-95',
        '59.809.676/0001-73',
      ];

      validCNPJs.forEach((cnpj) => {
        const result = CNPJ.create(cnpj);
        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CNPJ);
      });
    });

    it('should reject CNPJs with incorrect check digits', () => {
      const invalidCNPJs = [
        '11.222.333/0001-80', // Wrong second digit
        '11.222.333/0001-91', // Wrong first digit
        '07.255.866/0001-83', // Wrong second digit
        '07.255.866/0001-94', // Wrong first digit
      ];

      invalidCNPJs.forEach((cnpj) => {
        const result = CNPJ.create(cnpj);
        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CNPJ');
      });
    });
  });
});
