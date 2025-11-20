import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { CreateStoreUseCase } from 'src/core/modules/store/useCases/createStore.useCase';
import { DataSource } from 'src/common/dataSource/dataSource.interface';

describe('CreateStoreUseCase', () => {
  let useCase: CreateStoreUseCase;
  let storeGateway: StoreGateway;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      saveStore: jest.fn(),
    };

    storeGateway = new StoreGateway(mockDataSource as DataSource);
    useCase = new CreateStoreUseCase(storeGateway);
  });

  it('should create a store successfully', async () => {
    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(null);
    (mockDataSource.findStoreByCnpj as jest.Mock).mockResolvedValue(null);
    (mockDataSource.findStoreByName as jest.Mock).mockResolvedValue(null);
    (mockDataSource.saveStore as jest.Mock).mockResolvedValue(undefined);

    const result = await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.name).toBe('Store Name');
    expect(result.value!.fantasyName).toBe('Fantasy Name');
    expect(result.value!.cnpj.toString()).toBe('11222333000181');
    expect(result.value!.email.toString()).toBe('email@example.com');
    expect(result.value!.phone.toString()).toBe('5511999999999');
    expect(result.value!.totems).toEqual([]);
    expect(result.value!.createdAt).toBeInstanceOf(Date);
    expect(result.value!.id).toBeDefined();
    expect(result.value!.salt).toBeDefined();
    expect(result.value!.passwordHash).toBeDefined();

    expect(mockDataSource.saveStore).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Store Name',
        fantasy_name: 'Fantasy Name',
        email: 'email@example.com',
        cnpj: '11222333000181',
        phone: '5511999999999',
      }),
    );
  });

  it('should fail to create a store with the same email', async () => {
    const existingStoreDTO = {
      id: 'existing-store-id',
      name: 'Existing Store',
      fantasy_name: 'Existing Fantasy',
      email: 'email@example.com',
      cnpj: '11222333000181',
      phone: '5511999999999',
      salt: 'some-salt',
      password_hash: 'some-hash',
      created_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(
      existingStoreDTO,
    );
    (mockDataSource.findStoreByCnpj as jest.Mock).mockResolvedValue(null);
    (mockDataSource.findStoreByName as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute({
      cnpj: '75914784000162',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe('Store with this email already exists');
  });

  it('should fail to create a store with the same CNPJ', async () => {
    const existingStoreDTO = {
      id: 'existing-store-id',
      name: 'Existing Store',
      fantasy_name: 'Existing Fantasy',
      email: 'existing@example.com',
      cnpj: '11222333000181',
      phone: '5511999999999',
      salt: 'some-salt',
      password_hash: 'some-hash',
      created_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(null);
    (mockDataSource.findStoreByCnpj as jest.Mock).mockResolvedValue(
      existingStoreDTO,
    );
    (mockDataSource.findStoreByName as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute({
      cnpj: '11222333000181',
      email: 'other@example.com',
      fantasyName: 'Other Fantasy Name',
      name: 'Other Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe('Store with this CNPJ already exists');
  });

  it('should fail to create a store with the same name', async () => {
    const existingStoreDTO = {
      id: 'existing-store-id',
      name: 'Store Name',
      fantasy_name: 'Existing Fantasy',
      email: 'existing@example.com',
      cnpj: '11222333000181',
      phone: '5511999999999',
      salt: 'some-salt',
      password_hash: 'some-hash',
      created_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(null);
    (mockDataSource.findStoreByCnpj as jest.Mock).mockResolvedValue(null);
    (mockDataSource.findStoreByName as jest.Mock).mockResolvedValue(
      existingStoreDTO,
    );

    const result = await useCase.execute({
      cnpj: '75914784000162',
      email: 'other@example.com',
      fantasyName: 'Other Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe('Store with this name already exists');
  });
});
