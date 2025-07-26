import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

describe('CPF Value Object', () => {
  describe('create', () => {
    describe('valid CPF numbers', () => {
      it('should create a valid CPF with formatting', () => {
        const result = CPF.create('529.982.247-25');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('52998224725');
        expect(result.value!.format()).toBe('529.982.247-25');
      });

      it('should create a valid CPF without formatting', () => {
        const result = CPF.create('52998224725');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('52998224725');
        expect(result.value!.format()).toBe('529.982.247-25');
      });

      it('should create a valid CPF with partial formatting', () => {
        const result = CPF.create('529982247-25');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('52998224725');
        expect(result.value!.format()).toBe('529.982.247-25');
      });

      it('should create a valid CPF with mixed formatting characters', () => {
        const result = CPF.create('529-982-247.25');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('52998224725');
        expect(result.value!.format()).toBe('529.982.247-25');
      });

      it('should create a valid CPF with spaces', () => {
        const result = CPF.create(' 529 982 247 25 ');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('52998224725');
        expect(result.value!.format()).toBe('529.982.247-25');
      });

      it('should create another valid CPF', () => {
        const result = CPF.create('123.456.789-09');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('12345678909');
        expect(result.value!.format()).toBe('123.456.789-09');
      });

      it('should create a valid CPF with check digit 0', () => {
        const result = CPF.create('111.444.777-35');

        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
        expect(result.value!.toString()).toBe('11144477735');
        expect(result.value!.format()).toBe('111.444.777-35');
      });
    });

    describe('invalid CPF numbers', () => {
      it('should return error for CPF with wrong check digits', () => {
        const result = CPF.create('529.982.247-26');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for CPF with all same digits', () => {
        const result = CPF.create('111.111.111-11');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for CPF with all zeros', () => {
        const result = CPF.create('000.000.000-00');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for CPF too short', () => {
        const result = CPF.create('123.456.789-0');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for CPF too long', () => {
        const result = CPF.create('123.456.789-099');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for empty string', () => {
        const result = CPF.create('');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for non-numeric characters only', () => {
        const result = CPF.create('abc.def.ghi-jk');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for CPF with invalid first check digit', () => {
        const result = CPF.create('529.982.247-35');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for CPF with invalid second check digit', () => {
        const result = CPF.create('529.982.247-24');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for whitespace-only string', () => {
        const result = CPF.create('   ');

        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });

      it('should return error for sequential digits', () => {
        const invalidSequentialCPFs = [
          '222.222.222-22',
          '333.333.333-33',
          '444.444.444-44',
          '555.555.555-55',
          '666.666.666-66',
          '777.777.777-77',
          '888.888.888-88',
          '999.999.999-99',
        ];

        invalidSequentialCPFs.forEach((cpf) => {
          const result = CPF.create(cpf);
          expect(result.value).toBeUndefined();
          expect(result.error).toBeInstanceOf(ResourceInvalidException);
          expect(result.error!.message).toBe('Invalid CPF');
        });
      });
    });
  });

  describe('format', () => {
    it('should format CPF correctly', () => {
      const result = CPF.create('52998224725');
      const cpf = result.value!;

      expect(cpf.format()).toBe('529.982.247-25');
    });

    it('should format another CPF correctly', () => {
      const result = CPF.create('12345678909');
      const cpf = result.value!;

      expect(cpf.format()).toBe('123.456.789-09');
    });
  });

  describe('toString', () => {
    it('should return clean digits', () => {
      const result = CPF.create('529.982.247-25');
      const cpf = result.value!;

      expect(cpf.toString()).toBe('52998224725');
    });

    it('should return clean digits for unformatted input', () => {
      const result = CPF.create('52998224725');
      const cpf = result.value!;

      expect(cpf.toString()).toBe('52998224725');
    });
  });

  describe('equals', () => {
    it('should return true for equivalent CPF numbers with different formatting', () => {
      const cpf1Result = CPF.create('529.982.247-25');
      const cpf2Result = CPF.create('52998224725');
      const cpf3Result = CPF.create('529982247-25');

      const cpf1 = cpf1Result.value!;
      const cpf2 = cpf2Result.value!;
      const cpf3 = cpf3Result.value!;

      expect(cpf1.equals(cpf2)).toBe(true);
      expect(cpf1.equals(cpf3)).toBe(true);
      expect(cpf2.equals(cpf3)).toBe(true);
    });

    it('should return false for different CPF numbers', () => {
      const cpf1Result = CPF.create('529.982.247-25');
      const cpf2Result = CPF.create('123.456.789-09');

      const cpf1 = cpf1Result.value!;
      const cpf2 = cpf2Result.value!;

      expect(cpf1.equals(cpf2)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be frozen and immutable', () => {
      const result = CPF.create('52998224725');
      const cpf = result.value!;

      expect(Object.isFrozen(cpf)).toBe(true);

      // Attempting to modify should throw
      expect(() => {
        (cpf as any).digits = 'modified';
      }).toThrow();

      // Value should remain unchanged
      expect(cpf.toString()).toBe('52998224725');
    });
  });

  describe('CPF validation algorithm', () => {
    it('should validate check digits correctly for various valid CPFs', () => {
      const validCPFs = [
        '358.949.300-30',
        '103.606.920-60',
        '546.427.340-90',
        '642.799.810-27',
        '374.114.140-26',
      ];

      validCPFs.forEach((cpf) => {
        const result = CPF.create(cpf);
        expect(result.error).toBeUndefined();
        expect(result.value).toBeInstanceOf(CPF);
      });
    });

    it('should reject CPFs with incorrect check digits', () => {
      const invalidCPFs = [
        '529.982.247-24', // Wrong second digit
        '529.982.247-35', // Wrong first digit
        '123.456.789-08', // Wrong second digit
        '123.456.789-19', // Wrong first digit
      ];

      invalidCPFs.forEach((cpf) => {
        const result = CPF.create(cpf);
        expect(result.value).toBeUndefined();
        expect(result.error).toBeInstanceOf(ResourceInvalidException);
        expect(result.error!.message).toBe('Invalid CPF');
      });
    });
  });
});
