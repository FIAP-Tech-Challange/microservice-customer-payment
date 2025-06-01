/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/unbound-method */
import { StoresController } from '../../../../src/modules/stores/adapters/primary/stores.controller';
import { StoresService } from '../../../../src/modules/stores/services/stores.service';
import { StoreModel } from '../../../../src/modules/stores/models/domain/store.model';
import { TotemModel } from '../../../../src/modules/stores/models/domain/totem.model';
import { CreateStoreInputDto } from '../../../../src/modules/stores/models/dtos/create-store.dto';
import { RequestFromStore } from '../../../../src/modules/auth/models/dtos/request.dto';
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

  describe('deleteTotem', () => {
    it('should delete a totem', async () => {
      const req = {
        storeId: 'test-store-id',
      } as RequestFromStore;

      const totemId = 'test-totem-id';

      storeService.deleteTotem = jest.fn().mockResolvedValue(undefined);

      await controller.deleteTotem(req, totemId);

      expect(storeService.deleteTotem).toHaveBeenCalledWith(
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
        email: { toString: () => 'email@example.com' },
        cnpj: { toString: () => '12345678901234' },
        phone: { toString: () => '11999999999' },
        totems: [],
      } as unknown as StoreModel;

      const mockSimplifiedDTO = {
        id: mockStore.id,
        name: mockStore.name,
        fantasyName: mockStore.fantasyName,
        email: 'email@example.com',
        cnpj: '12345678901234',
        phone: '11999999999',
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

  // No pingFromTotem method in the controller
});
