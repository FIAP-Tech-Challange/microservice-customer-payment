/* eslint-disable @typescript-eslint/unbound-method */
import { StoresController } from '../../../../src/modules/stores/adapters/primary/stores.controller';
import { StoresService } from '../../../../src/modules/stores/stores.service';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';
import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';
import { CreateStoreInputDto } from '../../../../src/modules/stores/models/dtos/create-store.dto';
import {
  RequestFromStore,
  RequestFromTotem,
} from '../../../../src/modules/auth/models/dtos/request.dto';
import { StoreMapper } from '../../../../src/modules/stores/models/store.mapper';

describe('StoresController', () => {
  let controller: StoresController;
  let storeService: StoresService;

  beforeEach(() => {
    storeService = {} as StoresService;
    controller = new StoresController(storeService);
  });

  describe('create', () => {
    it('should create a store and return its ID', async () => {
      const createStoreDto: CreateStoreInputDto = {
        name: 'Store Name',
        fantasy_name: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        password: 'password123',
        phone: '11999999999',
      };

      const mockStore = {
        id: 'test-store-id',
      } as StoreModel;

      storeService.create = jest.fn().mockResolvedValue(mockStore);

      const result = await controller.create(createStoreDto);

      expect(storeService.create).toHaveBeenCalledWith(createStoreDto);
      expect(result).toEqual({ id: mockStore.id });
    });
  });

  describe('createTotem', () => {
    it('should create a totem and return its ID', async () => {
      const req = {
        storeId: 'test-store-id',
      } as RequestFromStore;

      const totemName = 'New Totem';

      const mockTotem = {
        id: 'test-totem-id',
        name: totemName,
      } as TotemModel;

      storeService.createTotem = jest.fn().mockResolvedValue(mockTotem);

      const result = await controller.createTotem(req, totemName);

      expect(storeService.createTotem).toHaveBeenCalledWith(
        req.storeId,
        totemName,
      );
      expect(result).toEqual({ id: mockTotem.id });
    });
  });

  describe('inactivateTotem', () => {
    it('should inactivate a totem', async () => {
      const req = {
        storeId: 'test-store-id',
      } as RequestFromStore;

      const totemId = 'test-totem-id';

      storeService.inactivateTotem = jest.fn().mockResolvedValue(undefined);

      await controller.inactivateTotem(req, totemId);

      expect(storeService.inactivateTotem).toHaveBeenCalledWith(
        req.storeId,
        totemId,
      );
    });
  });

  describe('findById', () => {
    it('should find a store by ID and return simplified store DTO', async () => {
      const req = {
        storeId: 'test-store-id',
      } as RequestFromStore;

      const mockStore = {
        id: 'test-store-id',
        name: 'Store Name',
        fantasyName: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '12345678901234',
        phone: '11999999999',
        isActive: true,
        totems: [],
      } as unknown as StoreModel;

      const mockSimplifiedDTO = {
        id: mockStore.id,
        name: mockStore.name,
        fantasyName: mockStore.fantasyName,
        email: mockStore.email,
        cnpj: mockStore.cnpj,
        phone: mockStore.phone,
        isActive: mockStore.isActive,
        totems: [],
      };

      storeService.findById = jest.fn().mockResolvedValue(mockStore);
      jest
        .spyOn(StoreMapper, 'fromDomainToSimplifiedStoreDto')
        .mockReturnValue(mockSimplifiedDTO);

      const result = await controller.findById(req);

      expect(storeService.findById).toHaveBeenCalledWith(req.storeId);
      expect(StoreMapper.fromDomainToSimplifiedStoreDto).toHaveBeenCalledWith(
        mockStore,
      );
      expect(result).toEqual(mockSimplifiedDTO);
    });
  });

  describe('pingFromTotem', () => {
    it('should return totem information from the request', () => {
      const req = {
        storeId: 'test-store-id',
        totemId: 'test-totem-id',
        totemAccessToken: 'test-token',
        headers: {},
        query: {},
        params: {},
        body: {},
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
      } as unknown as RequestFromTotem;

      const result = controller.pingFromTotem(req);

      expect(result).toEqual({
        storeId: req.storeId,
        totemId: req.totemId,
        totemAccessToken: req.totemAccessToken,
      });
    });
  });
});
