jest.mock('src/core/common/utils/uuid.helper');

import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { generateUUID } from 'src/core/common/utils/uuid.helper';

describe('Totem Entity', () => {
  const MOCKED_UUID = 'mocked-uuid';
  const MOCKED_TOKEN_ACCESS = 'mocked-token-access';

  beforeEach(() => {
    jest
      .mocked(generateUUID)
      .mockReturnValueOnce(MOCKED_UUID)
      .mockReturnValueOnce(MOCKED_TOKEN_ACCESS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a valid totem with all required properties', () => {
      const totemData = {
        name: 'Test Totem',
      };

      const result = Totem.create(totemData);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Totem);
      expect(result.value!.name).toBe('Test Totem');
      expect(result.value!.id).toBe(MOCKED_UUID);
      expect(result.value!.tokenAccess).toBe(MOCKED_TOKEN_ACCESS);
      expect(result.value!.createdAt).toBeInstanceOf(Date);
    });

    it('should return error when name is empty', () => {
      const totemData = {
        name: '',
      };

      const result = Totem.create(totemData);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Name is required');
    });

    it('should generate unique id and tokenAccess', () => {
      const totemData = {
        name: 'Test Totem',
      };

      const result = Totem.create(totemData);

      expect(generateUUID).toHaveBeenCalledTimes(2);
      expect(result.value!.id).toBe(MOCKED_UUID);
      expect(result.value!.tokenAccess).toBe(MOCKED_TOKEN_ACCESS);
    });
  });

  describe('restore', () => {
    it('should restore a totem from valid props', () => {
      const totemProps = {
        id: 'test-id',
        name: 'Test Totem',
        tokenAccess: 'test-token-access',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      const result = Totem.restore(totemProps);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Totem);
      expect(result.value!.id).toBe('test-id');
      expect(result.value!.name).toBe('Test Totem');
      expect(result.value!.tokenAccess).toBe('test-token-access');
      expect(result.value!.createdAt).toEqual(
        new Date('2023-01-01T00:00:00.000Z'),
      );
    });

    it('should return error when restoring with empty id', () => {
      const totemProps = {
        id: '',
        name: 'Test Totem',
        tokenAccess: 'test-token-access',
        createdAt: new Date(),
      };

      const result = Totem.restore(totemProps);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Id is required');
    });

    it('should return error when restoring with empty name', () => {
      const totemProps = {
        id: 'test-id',
        name: '',
        tokenAccess: 'test-token-access',
        createdAt: new Date(),
      };

      const result = Totem.restore(totemProps);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Name is required');
    });

    it('should return error when restoring with empty tokenAccess', () => {
      const totemProps = {
        id: 'test-id',
        name: 'Test Totem',
        tokenAccess: '',
        createdAt: new Date(),
      };

      const result = Totem.restore(totemProps);

      expect(result.value).toBeUndefined();
      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Token access is required');
    });
  });

  describe('getters', () => {
    let totem: Totem;

    beforeEach(() => {
      const result = Totem.create({
        name: 'Test Totem',
      });
      totem = result.value!;
    });

    it('should return correct property values', () => {
      expect(totem.id).toBe(MOCKED_UUID);
      expect(totem.name).toBe('Test Totem');
      expect(totem.tokenAccess).toBe(MOCKED_TOKEN_ACCESS);
      expect(totem.createdAt).toBeInstanceOf(Date);
    });

    it('should return immutable properties', () => {
      const originalId = totem.id;
      const originalName = totem.name;
      const originalTokenAccess = totem.tokenAccess;
      const originalCreatedAt = totem.createdAt;

      expect(totem.id).toBe(originalId);
      expect(totem.name).toBe(originalName);
      expect(totem.tokenAccess).toBe(originalTokenAccess);
      expect(totem.createdAt).toBe(originalCreatedAt);
    });
  });
});
