/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';
import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';
import { Email } from '../../../../src/shared/domain/email.vo';
import { BrazilianPhone } from '../../../../src/shared/domain/brazilian-phone.vo';
import { CNPJ } from '../../../../src/modules/stores/models/domain/cnpj.vo';

describe('StoreModel', () => {
  describe('create', () => {
    it('should create a store with valid properties', () => {
      const validProps = {
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
      };

      const store = StoreModel.create(validProps);

      expect(store).toBeInstanceOf(StoreModel);
      expect(store.id).toBeDefined();
      expect(store.name).toBe(validProps.name);
      expect(store.fantasyName).toBe(validProps.fantasyName);
      expect(store.email).toBeInstanceOf(Email);
      expect(store.cnpj).toBeInstanceOf(CNPJ);
      expect(store.phone).toBeInstanceOf(BrazilianPhone);
      expect(store.passwordHash).toBeDefined();
      expect(store.salt).toBeDefined();
      expect(store.totems).toEqual([]);
      expect(store.createdAt).toBeDefined();
    });

    it('should throw error if missing required properties', () => {
      const invalidProps = {
        name: '',
        fantasyName: 'Fantasy Name',
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
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
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        salt: 'test-salt',
        passwordHash: 'hashed-password',
        phone: new BrazilianPhone('11999999999'),
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
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword,
        phone: new BrazilianPhone('11999999999'),
      });

      const result = store.verifyPassword(plainPassword);

      expect(result).toBe(true);
    });

    it('should return false for an incorrect password', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
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
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
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
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
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
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
      });

      const totem1 = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem1);

      const sameIdTotem = TotemModel.create({ name: 'Different Name' });

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
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
      });

      const totem1 = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem1);

      const sameTokenTotem = TotemModel.create({ name: 'Different Name' });

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

  describe('removeTotem', () => {
    it('should remove a totem from the store', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
      });

      const totem = TotemModel.create({ name: 'Totem 1' });
      store.addTotem(totem);

      const removedTotem = store.removeTotem(totem.id);

      expect(removedTotem).toEqual(totem);
      expect(store.totems).toHaveLength(0);
    });

    it('should throw error when removing a non-existent totem', () => {
      const store = StoreModel.create({
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        plainPassword: 'password123',
        phone: new BrazilianPhone('11999999999'),
      });

      expect(() => store.removeTotem('non-existent-id')).toThrow(
        NotFoundException,
      );
      expect(() => store.removeTotem('non-existent-id')).toThrow(
        'Totem not found',
      );
    });
  });

  // No activate/inactivate methods available in current implementation

  describe('validation during restore', () => {
    it('should validate all required fields during restore', () => {
      const baseProps = {
        id: 'test-id',
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: new Email('email@example.com'),
        cnpj: new CNPJ('11222333000181'),
        salt: 'test-salt',
        passwordHash: 'hashed-password',
        phone: new BrazilianPhone('11999999999'),
        totems: [],
        createdAt: new Date(),
      };

      expect(() => StoreModel.restore({ ...baseProps, id: '' })).toThrow(
        'ID is required',
      );

      expect(() => StoreModel.restore({ ...baseProps, name: '' })).toThrow(
        'Name is required',
      );

      expect(() =>
        StoreModel.restore({ ...baseProps, email: null as unknown as Email }),
      ).toThrow('Email must be an Email value object');

      expect(() =>
        StoreModel.restore({ ...baseProps, cnpj: null as unknown as CNPJ }),
      ).toThrow('CNPJ must be a CNPJ value object');

      expect(() => StoreModel.restore({ ...baseProps, salt: '' })).toThrow(
        'Salt is required',
      );

      expect(() =>
        StoreModel.restore({ ...baseProps, passwordHash: '' }),
      ).toThrow('Password hash is required');

      expect(() =>
        StoreModel.restore({ ...baseProps, fantasyName: '' }),
      ).toThrow('Fantasy name is required');

      expect(() =>
        StoreModel.restore({
          ...baseProps,
          phone: null as unknown as BrazilianPhone,
        }),
      ).toThrow('Phone is required');

      expect(() =>
        StoreModel.restore({ ...baseProps, totems: null as any }),
      ).toThrow('Totems is required');
    });
  });
});
