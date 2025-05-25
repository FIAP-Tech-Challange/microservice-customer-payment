/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException } from '@nestjs/common';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';
import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';

describe('StoreModel', () => {
  describe('create', () => {
    it('should create a store with valid properties', () => {
      const validProps = {
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      };

      const store = StoreModel.create(validProps);

      expect(store).toBeInstanceOf(StoreModel);
      expect(store.id).toBeDefined();
      expect(store.name).toBe(validProps.name);
      expect(store.fantasyName).toBe(validProps.fantasyName);
      expect(store.email).toBe(validProps.email);
      expect(store.cnpj).toBe(validProps.cnpj);
      expect(store.phone).toBe(validProps.phone);
      expect(store.passwordHash).toBeDefined();
      expect(store.salt).toBeDefined();
      expect(store.isActive).toBe(true);
      expect(store.totems).toEqual([]);
      expect(store.createdAt).toBeDefined();
    });

    it('should throw error if missing required properties', () => {
      const invalidProps = {
        name: '',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      };

      expect(() => StoreModel.create(invalidProps)).toThrow('Name is required');
    });
  });

  describe('restore', () => {
    it('should restore a store from properties', () => {
      const props = {
        id: 'test-id',
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        salt: 'test-salt',
        passwordHash: 'hashed-password',
        phone: '11999999999',
        isActive: true,
        totems: [],
        createdAt: new Date(),
      };

      const store = StoreModel.restore(props);

      expect(store).toBeInstanceOf(StoreModel);
      expect(store.id).toBe(props.id);
      expect(store.name).toBe(props.name);
      expect(store.fantasyName).toBe(props.fantasyName);
      expect(store.email).toBe(props.email);
      expect(store.cnpj).toBe(props.cnpj);
      expect(store.phone).toBe(props.phone);
      expect(store.passwordHash).toBe(props.passwordHash);
      expect(store.salt).toBe(props.salt);
      expect(store.isActive).toBe(props.isActive);
      expect(store.totems).toBe(props.totems);
      expect(store.createdAt).toBe(props.createdAt);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for a correct password', () => {
      const plainPassword = 'password123';
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword,
        phone: '11999999999',
      });

      const result = store.verifyPassword(plainPassword);

      expect(result).toBe(true);
    });

    it('should return false for an incorrect password', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      const result = store.verifyPassword('wrongpassword');

      expect(result).toBe(false);
    });
  });

  describe('addTotem', () => {
    it('should add a totem to the store', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      const totem = TotemModel.create({ name: 'Totem 1' });

      store.addTotem(totem);

      expect(store.totems).toHaveLength(1);
      expect(store.totems[0]).toBe(totem);
    });

    it('should throw error when adding a totem with duplicate name', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      const totem1 = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem1);

      const totem2 = TotemModel.create({ name: 'Totem 1' });

      expect(() => store.addTotem(totem2)).toThrow(ConflictException);
      expect(() => store.addTotem(totem2)).toThrow(
        'Totem with this name already exists',
      );
    });

    it('should throw error when adding a totem with same id', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      const totem1 = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem1);

      // Mock a totem with the same ID but different name
      const sameIdTotem = TotemModel.create({ name: 'Different Name' });
      // Override the ID to be the same
      Object.defineProperty(sameIdTotem, 'id', { value: totem1.id });

      expect(() => store.addTotem(sameIdTotem)).toThrow(ConflictException);
      expect(() => store.addTotem(sameIdTotem)).toThrow(
        'Totem with this id already exists',
      );
    });

    it('should throw error when adding a totem with same token access', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      const totem1 = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem1);

      // Mock a totem with the same token access but different name and id
      const sameTokenTotem = TotemModel.create({ name: 'Different Name' });
      // Override the token access to be the same
      Object.defineProperty(sameTokenTotem, 'tokenAccess', {
        value: totem1.tokenAccess,
        writable: true,
        configurable: true,
      });

      expect(() => store.addTotem(sameTokenTotem)).toThrow(ConflictException);
      expect(() => store.addTotem(sameTokenTotem)).toThrow(
        'Totem with this token access already exists',
      );
    });
  });

  describe('inactivateTotem', () => {
    it('should inactivate a totem in the store', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      const totem = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem);

      store.inactivateTotem(totem.id);

      expect(store.totems[0].isActive).toBe(false);
    });

    it('should throw error when inactivating a non-existent totem', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      expect(() => store.inactivateTotem('non-existent-id')).toThrow(
        ConflictException,
      );
      expect(() => store.inactivateTotem('non-existent-id')).toThrow(
        'Totem not found',
      );
    });
  });

  describe('activate/inactivate', () => {
    it('should activate a store', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      store.inactivate();
      expect(store.isActive).toBe(false);

      store.activate();

      expect(store.isActive).toBe(true);
    });

    it('should inactivate a store', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        plainPassword: 'password123',
        phone: '11999999999',
      });

      store.inactivate();

      expect(store.isActive).toBe(false);
    });
  });

  describe('validation during restore', () => {
    it('should validate all required fields during restore', () => {
      // Base properties for a valid store
      const baseProps = {
        id: 'test-id',
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        salt: 'test-salt',
        passwordHash: 'hashed-password',
        phone: '11999999999',
        isActive: true,
        totems: [],
        createdAt: new Date(),
      };

      // Test validation for ID
      expect(() => StoreModel.restore({ ...baseProps, id: '' })).toThrow(
        'ID is required',
      );

      // Test validation for name
      expect(() => StoreModel.restore({ ...baseProps, name: '' })).toThrow(
        'Name is required',
      );

      // Test validation for email
      expect(() => StoreModel.restore({ ...baseProps, email: '' })).toThrow(
        'Email is required',
      );

      // Test validation for cnpj
      expect(() => StoreModel.restore({ ...baseProps, cnpj: '' })).toThrow(
        'CNPJ is required',
      );

      // Test validation for salt
      expect(() => StoreModel.restore({ ...baseProps, salt: '' })).toThrow(
        'Salt is required',
      );

      // Test validation for passwordHash
      expect(() =>
        StoreModel.restore({ ...baseProps, passwordHash: '' }),
      ).toThrow('Password hash is required');

      // Test validation for fantasyName
      expect(() =>
        StoreModel.restore({ ...baseProps, fantasyName: '' }),
      ).toThrow('Fantasy name is required');

      // Test validation for phone
      expect(() => StoreModel.restore({ ...baseProps, phone: '' })).toThrow(
        'Phone is required',
      );

      // Test validation for totems
      expect(() =>
        StoreModel.restore({ ...baseProps, totems: null as any }),
      ).toThrow('Totems is required');

      // Test validation for isActive
      expect(() =>
        StoreModel.restore({ ...baseProps, isActive: null as any }),
      ).toThrow('Is active must be a boolean');
    });
  });
});
