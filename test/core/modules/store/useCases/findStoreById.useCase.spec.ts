import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { DataSource } from 'src/common/dataSource/dataSource.interface';

describe('FindStoreByIdUseCase', () => {
  let useCase: FindStoreByIdUseCase;
  let storeGateway: StoreGateway;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      findStoreById: jest.fn(),
      saveStore: jest.fn(),
    };

    storeGateway = new StoreGateway(mockDataSource as DataSource);
    useCase = new FindStoreByIdUseCase(storeGateway);
  });

  it('should find store successfully by id', async () => {
    const store = Store.create({
      name: 'Test Store',
      fantasyName: 'Test Fantasy Store',
      email: Email.create('store@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Test Store',
      fantasy_name: 'Test Fantasy Store',
      email: 'store@example.com',
      cnpj: '11222333000181',
      phone: '5511999999999',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      created_at: store.value!.createdAt.toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreById as jest.Mock).mockResolvedValue(mockStoreDTO);

    const result = await useCase.execute(store.value!.id);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.id).toBe(store.value!.id);
    expect(result.value!.email.toString()).toBe('store@example.com');
    expect(result.value!.name).toBe('Test Store');
    expect(result.value!.fantasyName).toBe('Test Fantasy Store');
    expect(result.value!.cnpj.toString()).toBe('11222333000181');
    expect(result.value!.phone.toString()).toBe('5511999999999');
  });

  it('should return ResourceNotFoundException for non-existing store', async () => {
    (mockDataSource.findStoreById as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute('nonexistent');

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Store not found');
    expect(result.value).toBeUndefined();
  });

  it('should return complete store entity with all properties', async () => {
    const email = 'complete@example.com';
    const storeName = 'Complete Store';
    const fantasyName = 'Complete Fantasy';
    const cnpj = '11222333000181';
    const phone = '5511999999999';

    const store = Store.create({
      name: storeName,
      fantasyName: fantasyName,
      email: Email.create(email).value!,
      cnpj: CNPJ.create(cnpj).value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create(phone).value!,
    });

    const mockStoreDTO = {
      id: store.value!.id,
      name: storeName,
      fantasy_name: fantasyName,
      email: email,
      cnpj: cnpj,
      phone: phone,
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      created_at: store.value!.createdAt.toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreById as jest.Mock).mockResolvedValue(mockStoreDTO);

    const result = await useCase.execute(store.value!.id);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);

    const foundStore = result.value!;
    expect(foundStore.id).toBe(store.value!.id);
    expect(foundStore.name).toBe(storeName);
    expect(foundStore.fantasyName).toBe(fantasyName);
    expect(foundStore.email.toString()).toBe(email);
    expect(foundStore.cnpj.toString()).toBe(cnpj);
    expect(foundStore.phone.toString()).toBe(phone);
    expect(foundStore.salt).toBeDefined();
    expect(foundStore.passwordHash).toBeDefined();
    expect(foundStore.createdAt).toBeInstanceOf(Date);
    expect(foundStore.totems).toEqual([]);
  });
});
