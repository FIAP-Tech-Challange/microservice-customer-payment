import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { CategoryGateway } from 'src/core/modules/product/gateways/category.gateway';
import { CreateCategoryUseCase } from 'src/core/modules/product/useCases/createCategory.useCase';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { CreateStoreUseCase } from 'src/core/modules/store/useCases/createStore.useCase';
import { CreateStoreWithDefaultCategoriesUseCase } from 'src/core/modules/store/useCases/createStoreWithDeafaultCategories.useCase';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import { NotificationDataSource } from 'src/external/dataSources/notification/notification.dataSource';
import { createMockGeneralDataSource } from '../../../mock/generalDataSource.mock';

describe('CreateStoreWithDefaultCategoriesUseCase', () => {
  let storeGateway: StoreGateway;
  let categoryGateway: CategoryGateway;

  let useCase: CreateStoreWithDefaultCategoriesUseCase;
  let createStoreUseCase: CreateStoreUseCase;
  let createCategoryUseCase: CreateCategoryUseCase;
  let findStoreByIdUseCase: FindStoreByIdUseCase;

  let mockGeneralDataSource: jest.Mocked<GeneralDataSource>;

  beforeEach(() => {
    mockGeneralDataSource = createMockGeneralDataSource();

    const mockNotificationDataSource: jest.Mocked<NotificationDataSource> = {
      sendSMSNotification: jest.fn(),
      sendWhatsappNotification: jest.fn(),
      sendEmailNotification: jest.fn(),
      sendMonitorNotification: jest.fn(),
    };

    const fakePaymentDataSource = new FakePaymentDataSource();
    const dataSource = new DataSourceProxy(
      mockGeneralDataSource,
      fakePaymentDataSource,
      mockNotificationDataSource,
    );

    storeGateway = new StoreGateway(dataSource);
    categoryGateway = new CategoryGateway(dataSource);

    findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
    createStoreUseCase = new CreateStoreUseCase(storeGateway);
    createCategoryUseCase = new CreateCategoryUseCase(
      categoryGateway,
      findStoreByIdUseCase,
    );
    useCase = new CreateStoreWithDefaultCategoriesUseCase(
      createStoreUseCase,
      createCategoryUseCase,
    );
  });

  it('should create a store successfully', async () => {
    // Configure mocks to simulate store creation success
    mockGeneralDataSource.findStoreByEmail.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValue(null);
    mockGeneralDataSource.saveStore.mockResolvedValue();
    mockGeneralDataSource.saveCategory.mockResolvedValue();

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

    // Mock findStoreById to return the created store
    const mockStoreDTO = {
      id: result.value!.id,
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: result.value!.salt,
      password_hash: result.value!.passwordHash,
      phone: '5511999999999',
      created_at: result.value!.createdAt.toISOString(),
      totems: [],
    };

    mockGeneralDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

    const gatewayStore = await storeGateway.findStoreById(result.value!.id);
    expect(gatewayStore.error).toBeUndefined();
    expect(gatewayStore.value).toBeInstanceOf(Store);
    expect(gatewayStore.value!.id).toBe(result.value!.id);
    expect(gatewayStore.value!.name).toBe('Store Name');
    expect(gatewayStore.value!.fantasyName).toBe('Fantasy Name');
    expect(gatewayStore.value!.cnpj.toString()).toBe('11222333000181');
    expect(gatewayStore.value!.email.toString()).toBe('email@example.com');
    expect(gatewayStore.value!.phone.toString()).toBe('5511999999999');
    expect(gatewayStore.value!.totems).toEqual([]);
    expect(gatewayStore.value!.createdAt.toISOString()).toBe(
      result.value!.createdAt.toISOString(),
    );
    expect(gatewayStore.value!.salt).toBe(result.value!.salt);
    expect(gatewayStore.value!.passwordHash).toBe(result.value!.passwordHash);
  });

  it('should fail to create a store with the same email', async () => {
    // Configure mocks for successful first store creation
    mockGeneralDataSource.findStoreByEmail.mockResolvedValueOnce(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValueOnce(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValueOnce(null);
    mockGeneralDataSource.saveStore.mockResolvedValue();
    mockGeneralDataSource.saveCategory.mockResolvedValue();

    await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    // Configure mocks to simulate email already exists
    const existingStoreDTO = {
      id: 'existing-store-id',
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: 'some-salt',
      password_hash: 'some-hash',
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      totems: [],
    };

    mockGeneralDataSource.findStoreByEmail.mockResolvedValue(existingStoreDTO);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValue(null);

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
    // Configure mocks for successful first store creation
    mockGeneralDataSource.findStoreByEmail.mockResolvedValueOnce(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValueOnce(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValueOnce(null);
    mockGeneralDataSource.saveStore.mockResolvedValue();
    mockGeneralDataSource.saveCategory.mockResolvedValue();

    await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    // Configure mocks to simulate CNPJ already exists
    const existingStoreDTO = {
      id: 'existing-store-id',
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: 'some-salt',
      password_hash: 'some-hash',
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      totems: [],
    };

    mockGeneralDataSource.findStoreByEmail.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValue(existingStoreDTO);
    mockGeneralDataSource.findStoreByName.mockResolvedValue(null);

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
    // Configure mocks for successful first store creation
    mockGeneralDataSource.findStoreByEmail.mockResolvedValueOnce(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValueOnce(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValueOnce(null);
    mockGeneralDataSource.saveStore.mockResolvedValue();
    mockGeneralDataSource.saveCategory.mockResolvedValue();

    await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

    // Configure mocks to simulate name already exists
    const existingStoreDTO = {
      id: 'existing-store-id',
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: 'some-salt',
      password_hash: 'some-hash',
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      totems: [],
    };

    mockGeneralDataSource.findStoreByEmail.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValue(existingStoreDTO);

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

  it('should create the base categories for the store', async () => {
    // Configure mocks for successful store creation
    mockGeneralDataSource.findStoreByEmail.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByCnpj.mockResolvedValue(null);
    mockGeneralDataSource.findStoreByName.mockResolvedValue(null);
    mockGeneralDataSource.saveStore.mockResolvedValue();
    mockGeneralDataSource.saveCategory.mockResolvedValue();

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

    // Mock store for category gateway calls
    const mockStoreDTO = {
      id: result.value!.id,
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: result.value!.salt,
      password_hash: result.value!.passwordHash,
      phone: '5511999999999',
      created_at: result.value!.createdAt.toISOString(),
      totems: [],
    };

    mockGeneralDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

    // Mock category responses
    const createMockCategoryDTO = (name: string, id: string) => ({
      id,
      name,
      store_id: result.value!.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      products: [],
    });

    mockGeneralDataSource.findCategoryByNameAndStoreId
      .mockResolvedValueOnce(createMockCategoryDTO('Lanche', 'lanche-id'))
      .mockResolvedValueOnce(
        createMockCategoryDTO('Acompanhamento', 'acompanhamento-id'),
      )
      .mockResolvedValueOnce(createMockCategoryDTO('Bebida', 'bebida-id'))
      .mockResolvedValueOnce(
        createMockCategoryDTO('Sobremesa', 'sobremesa-id'),
      );

    const categories = await Promise.all([
      categoryGateway.findCategoryByName('Lanche', result.value!.id),
      categoryGateway.findCategoryByName('Acompanhamento', result.value!.id),
      categoryGateway.findCategoryByName('Bebida', result.value!.id),
      categoryGateway.findCategoryByName('Sobremesa', result.value!.id),
    ]);

    expect(categories.every((category) => category.error)).toBe(false);
    expect(categories.every((category) => category.value)).toBe(true);
  });
});
