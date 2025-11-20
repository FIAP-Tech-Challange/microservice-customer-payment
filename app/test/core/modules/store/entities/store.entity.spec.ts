jest.mock('src/core/common/utils/uuid.helper');
jest.mock('src/core/common/utils/encoder.helper');

import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { generateUUID } from 'src/core/common/utils/uuid.helper';
import { encodeString } from 'src/core/common/utils/encoder.helper';

describe('Store Entity', () => {
  let validEmail: Email;
  let validCNPJ: CNPJ;
  let validPhone: BrazilianPhone;
  const MOCKED_UUID = 'mocked-uuid';
  const MOCKED_HASH = 'mocked-hash';

  beforeEach(() => {
    jest.mocked(generateUUID).mockReturnValue(MOCKED_UUID);
    jest.mocked(encodeString).mockReturnValue(MOCKED_HASH);

    const emailResult = Email.create('test@example.com');
    const cnpjResult = CNPJ.create('11.222.333/0001-81');
    const phoneResult = BrazilianPhone.create('11987654321');

    if (emailResult.error || cnpjResult.error || phoneResult.error) {
      throw new Error('Failed to create valid value objects for testing');
    }

    validEmail = emailResult.value;
    validCNPJ = cnpjResult.value;
    validPhone = phoneResult.value;
  });

  describe('create', () => {
    it('should create a valid store with all required properties', () => {
      const storeData = {
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCNPJ,
        plainPassword: 'password123',
        phone: validPhone,
      };

      const result = Store.create(storeData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
      expect(result.value!.name).toBe('Test Store');
      expect(result.value!.fantasyName).toBe('Test Fantasy');
      expect(result.value!.email).toBe(validEmail);
      expect(result.value!.cnpj).toBe(validCNPJ);
      expect(result.value!.phone).toBe(validPhone);
      expect(result.value!.id).toBe(MOCKED_UUID);
      expect(result.value!.salt).toBe(MOCKED_UUID);
      expect(result.value!.passwordHash).toBe(MOCKED_HASH);
      expect(result.value!.totems).toEqual([]);
      expect(result.value!.createdAt).toBeInstanceOf(Date);
    });

    it('should return error when name is empty', () => {
      const storeData = {
        name: '',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCNPJ,
        plainPassword: 'password123',
        phone: validPhone,
      };

      const result = Store.create(storeData);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Name is required');
    });

    it('should return error when fantasy name is empty', () => {
      const storeData = {
        name: 'Test Store',
        fantasyName: '',
        email: validEmail,
        cnpj: validCNPJ,
        plainPassword: 'password123',
        phone: validPhone,
      };

      const result = Store.create(storeData);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Fantasy name is required');
    });
  });

  describe('restore', () => {
    it('should restore a store from valid props', () => {
      const storeProps = {
        id: 'test-id',
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        phone: validPhone,
        salt: 'test-salt',
        passwordHash: 'test-hash',
        cnpj: validCNPJ,
        createdAt: new Date(),
        totems: [],
      };

      const result = Store.restore(storeProps);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
      expect(result.value!.id).toBe('test-id');
      expect(result.value!.name).toBe('Test Store');
      expect(result.value!.salt).toBe('test-salt');
      expect(result.value!.passwordHash).toBe('test-hash');
    });

    it('should return error when restoring with invalid props', () => {
      const storeProps = {
        id: '',
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        phone: validPhone,
        salt: 'test-salt',
        passwordHash: 'test-hash',
        cnpj: validCNPJ,
        createdAt: new Date(),
        totems: [],
      };

      const result = Store.restore(storeProps);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('ID is required');
    });
  });

  describe('verifyPassword', () => {
    let store: Store;

    beforeEach(() => {
      jest
        .mocked(encodeString)
        .mockImplementation((string, salt) => `${string}${salt}`);

      const result = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCNPJ,
        plainPassword: 'password123',
        phone: validPhone,
      });

      store = result.value!;
    });

    it('should return true for a correct password', () => {
      const result = store.verifyPassword('password123');

      expect(result).toBe(true);
    });

    it('should return false for an incorrect password', () => {
      const result = store.verifyPassword('wrongpassword');

      expect(result).toBe(false);
    });
  });

  describe('addTotem', () => {
    let store: Store;
    let totem: Totem;

    beforeEach(() => {
      const storeResult = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCNPJ,
        plainPassword: 'password123',
        phone: validPhone,
      });
      store = storeResult.value!;

      const totemResult = Totem.create({ name: 'Test Totem' });
      totem = totemResult.value!;
    });

    it('should successfully add a totem', () => {
      const result = store.addTotem(totem);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeUndefined();
      expect(store.totems).toHaveLength(1);
      expect(store.totems[0]).toBe(totem);
    });

    it('should return error when adding totem with duplicate name', () => {
      store.addTotem(totem);

      const duplicateTotem = Totem.create({ name: 'Test Totem' });
      const result = store.addTotem(duplicateTotem.value!);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe('Totem with this name already exists');
      expect(store.totems).toHaveLength(1);
    });

    it('should return error when adding totem with duplicate token access', () => {
      const firstTotem = Totem.restore({
        id: 'Totem_id_1',
        name: 'First Totem',
        tokenAccess: 'same-token',
        createdAt: new Date(),
      });
      const secondTotem = Totem.restore({
        id: 'Totem_id_2',
        name: 'Second Totem',
        tokenAccess: 'same-token',
        createdAt: new Date(),
      });

      store.addTotem(firstTotem.value!);
      const result = store.addTotem(secondTotem.value!);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe(
        'Totem with this token access already exists',
      );
      expect(store.totems).toHaveLength(1);
    });

    it('should return error when adding totem with duplicate id', () => {
      const firstTotem = Totem.restore({
        id: 'totem_id',
        name: 'First Totem',
        tokenAccess: 'Token_1',
        createdAt: new Date(),
      });
      const secondTotem = Totem.restore({
        id: 'totem_id',
        name: 'Second Totem',
        tokenAccess: 'Token_2',
        createdAt: new Date(),
      });

      store.addTotem(firstTotem.value!);
      const result = store.addTotem(secondTotem.value!);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceConflictException);
      expect(result.error!.message).toBe('Totem with this id already exists');
      expect(store.totems).toHaveLength(1);
    });
  });

  describe('getters', () => {
    let store: Store;

    beforeEach(() => {
      const result = Store.create({
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        email: validEmail,
        cnpj: validCNPJ,
        plainPassword: 'password123',
        phone: validPhone,
      });
      store = result.value!;
    });

    it('should return correct property values', () => {
      expect(store.id).toBe(MOCKED_UUID);
      expect(store.name).toBe('Test Store');
      expect(store.fantasyName).toBe('Test Fantasy');
      expect(store.email).toBe(validEmail);
      expect(store.cnpj).toBe(validCNPJ);
      expect(store.phone).toBe(validPhone);
      expect(store.salt).toBe(MOCKED_UUID);
      expect(store.passwordHash).toBe(MOCKED_HASH);
      expect(store.createdAt).toBeInstanceOf(Date);
      expect(store.totems).toEqual([]);
    });
  });
});
