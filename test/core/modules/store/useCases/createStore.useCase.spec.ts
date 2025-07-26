import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { CreateStoreUseCase } from 'src/core/modules/store/useCases/createStore.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { InMemoryGeneralDataSource } from 'src/external/dataSources/general/inMemory/inMemoryGeneralDataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';

describe('CreateStoreUseCase', () => {
  let useCase: CreateStoreUseCase;
  let storeGateway: StoreGateway;

  beforeEach(() => {
    const inMemoryDataSource = new InMemoryGeneralDataSource();
    const fakePaymentDataSource = new FakePaymentDataSource();
    const dataSource = new DataSourceProxy(
      inMemoryDataSource,
      fakePaymentDataSource,
    );

    storeGateway = new StoreGateway(dataSource);
    useCase = new CreateStoreUseCase(storeGateway);
  });

  it('should create a store successfully', async () => {
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
    await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

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
    await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

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
    await useCase.execute({
      cnpj: '11222333000181',
      email: 'email@example.com',
      fantasyName: 'Fantasy Name',
      name: 'Store Name',
      phone: '5511999999999',
      plainPassword: 'password123',
    });

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
