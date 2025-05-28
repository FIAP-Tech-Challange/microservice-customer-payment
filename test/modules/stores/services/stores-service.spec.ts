/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { StoresService } from '../../../../src/modules/stores/stores.service';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';
import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';
import { StoresRepositoryPort } from '../../../../src/modules/stores/ports/output/stores.repository.port';
import { CreateStoreInputDto } from '../../../../src/modules/stores/models/dtos/create-store.dto';
import { NotificationService } from '../../../../src/modules/notification/notification.service';
import { Email } from '../../../../src/shared/domain/email.vo';
import { CNPJ } from '../../../../src/modules/stores/models/domain/cnpj.vo';
import { BrazilianPhone } from '../../../../src/shared/domain/brazilian-phone.vo';

jest.mock('../../../../src/shared/domain/email.vo', () => {
  return {
    Email: jest.fn().mockImplementation((email: string) => {
      return {
        toString: (): string => email,
      };
    }),
  };
});

jest.mock('../../../../src/modules/stores/models/domain/cnpj.vo', () => {
  return {
    CNPJ: jest.fn().mockImplementation((cnpj: string) => {
      return {
        toString: (): string => cnpj,
      };
    }),
  };
});

jest.mock('../../../../src/shared/domain/brazilian-phone.vo', () => {
  return {
    BrazilianPhone: jest.fn().mockImplementation((phone: string) => {
      return {
        toString: (): string => phone,
      };
    }),
  };
});

describe('StoresService', () => {
  let service: StoresService;
  let storesRepository: jest.Mocked<StoresRepositoryPort>;
  let notificationService: jest.Mocked<NotificationService>;

  const originalCreate = StoreModel.create;
  beforeAll(() => {
    StoreModel.create = jest.fn().mockImplementation((props) => {
      return {
        id: 'mock-id',
        email: props.email as Email,
        cnpj: props.cnpj as CNPJ,
        name: props.name,
        fantasyName: props.fantasyName,
        phone: props.phone,
        verifyPassword: jest.fn().mockReturnValue(true),
        addTotem: jest.fn(),
        inactivateTotem: jest.fn(),
        validate: jest.fn(),
        isActive: true,
        totems: [],
        createdAt: new Date(),
      } as unknown as StoreModel;
    });
  });

  afterAll(() => {
    StoreModel.create = originalCreate;
  });
  beforeEach(() => {
    storesRepository = {
      findByEmail: jest.fn(),
      findByCnpj: jest.fn(),
      findById: jest.fn(),
      findByTotemAccessToken: jest.fn(),
      save: jest.fn(),
    };

    notificationService = {
      sendNotification: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<NotificationService>;

    service = new StoresService(storesRepository, notificationService);
  });

  describe('create', () => {
    it('should create a store with valid data', async () => {
      const createStoreDto: CreateStoreInputDto = {
        name: 'Store Name',
        fantasy_name: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '11222333000181',
        password: 'password123',
        phone: '11999999999',
      };

      storesRepository.findByEmail.mockResolvedValue(null);
      storesRepository.findByCnpj.mockResolvedValue(null);

      const result = await service.create(createStoreDto);

      expect(result).toHaveProperty('id');
      expect(storesRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(storesRepository.findByCnpj).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(storesRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const createStoreDto: CreateStoreInputDto = {
        name: 'Store Name',
        fantasy_name: 'Fantasy Name',
        email: 'existing@example.com',
        cnpj: '12345678901234',
        password: 'password123',
        phone: '11999999999',
      };

      const existingStore = {} as StoreModel;
      storesRepository.findByEmail.mockResolvedValue(existingStore);
      storesRepository.findByCnpj.mockResolvedValue(null);

      await expect(service.create(createStoreDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createStoreDto)).rejects.toThrow(
        'Store with this email already exists',
      );
    });

    it('should throw ConflictException when CNPJ already exists', async () => {
      const createStoreDto: CreateStoreInputDto = {
        name: 'Store Name',
        fantasy_name: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: 'existing-cnpj',
        password: 'password123',
        phone: '11999999999',
      };

      const existingStore = {} as StoreModel;
      storesRepository.findByEmail.mockResolvedValue(null);
      storesRepository.findByCnpj.mockResolvedValue(existingStore);

      await expect(service.create(createStoreDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createStoreDto)).rejects.toThrow(
        'Store with this CNPJ already exists',
      );
    });
  });

  describe('createTotem', () => {
    it('should create a totem for an existing store', async () => {
      const storeId = 'test-store-id';
      const totemName = 'New Totem';

      const mockStore = {
        id: storeId,
        addTotem: jest.fn(),
      } as unknown as StoreModel;

      storesRepository.findById.mockResolvedValue(mockStore);

      const result = await service.createTotem(storeId, totemName);

      expect(storesRepository.findById).toHaveBeenCalledWith(storeId);
      expect(mockStore.addTotem).toHaveBeenCalled();
      expect(storesRepository.save).toHaveBeenCalledWith(mockStore);
      expect(result).toBeInstanceOf(TotemModel);
      expect(result.name).toBe(totemName);
    });
  });

  describe('findByEmail', () => {
    it('should find a store by email', async () => {
      const emailStr = 'test@example.com';
      const email = new Email(emailStr);

      const mockStore = {
        email,
        id: 'test-id',
        name: 'Test Store',
        fantasyName: 'Test Fantasy',
        cnpj: new CNPJ('12345678901234'),
        phone: new BrazilianPhone('11999999999'),
        salt: 'test-salt',
        passwordHash: 'test-hash',
        isActive: true,
        totems: [],
        createdAt: new Date(),
        activate: jest.fn(),
        inactivate: jest.fn(),
        addTotem: jest.fn(),
        inactivateTotem: jest.fn(),
        verifyPassword: jest.fn(),
      } as unknown as StoreModel;

      storesRepository.findByEmail.mockResolvedValue(mockStore);

      const result = await service.findByEmail(emailStr);

      expect(storesRepository.findByEmail).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toBe(mockStore);
    });

    it('should throw NotFoundException when store not found by email', async () => {
      const emailStr = 'nonexistent@example.com';
      storesRepository.findByEmail.mockResolvedValue(null);

      await expect(service.findByEmail(emailStr)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByEmail(emailStr)).rejects.toThrow(
        'Store not found',
      );
    });
  });

  describe('findById', () => {
    it('should find a store by ID', async () => {
      const id = 'test-id';
      const mockStore = { id } as StoreModel;

      storesRepository.findById.mockResolvedValue(mockStore);

      const result = await service.findById(id);

      expect(storesRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(mockStore);
    });

    it('should throw NotFoundException when store not found by ID', async () => {
      const id = 'nonexistent-id';
      storesRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(id)).rejects.toThrow('Store not found');
    });
  });

  describe('findByTotemAccessToken', () => {
    it('should find a store by totem access token', async () => {
      const token = 'test-token';
      const mockStore = {} as StoreModel;

      storesRepository.findByTotemAccessToken.mockResolvedValue(mockStore);

      const result = await service.findByTotemAccessToken(token);

      expect(storesRepository.findByTotemAccessToken).toHaveBeenCalledWith(
        token,
      );
      expect(result).toBe(mockStore);
    });

    it('should throw NotFoundException when store not found by totem access token', async () => {
      const token = 'nonexistent-token';
      storesRepository.findByTotemAccessToken.mockResolvedValue(null);

      await expect(service.findByTotemAccessToken(token)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByTotemAccessToken(token)).rejects.toThrow(
        'Store not found',
      );
    });
  });

  describe('inactivateTotem', () => {
    it('should inactivate a totem in a store', async () => {
      const storeId = 'test-store-id';
      const totemId = 'test-totem-id';

      const mockStore = {
        id: storeId,
        inactivateTotem: jest.fn(),
      } as unknown as StoreModel;

      storesRepository.findById.mockResolvedValue(mockStore);

      await service.inactivateTotem(storeId, totemId);

      expect(storesRepository.findById).toHaveBeenCalledWith(storeId);
      expect(mockStore.inactivateTotem).toHaveBeenCalledWith(totemId);
      expect(storesRepository.save).toHaveBeenCalledWith(mockStore);
    });
  });
});
