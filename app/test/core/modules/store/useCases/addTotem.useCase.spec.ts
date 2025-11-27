import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { AddTotemUseCase } from 'src/core/modules/store/useCases/addTotem.useCase';
import { FindStoreByIdUseCase } from 'src/core/modules/store/useCases/findStoreById.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import {
  createMockGeneralDataSource,
  createMockNotificationDataSource,
} from '../../../mock';

describe('AddTotemUseCase', () => {
  let useCase: AddTotemUseCase;
  let storeGateway: StoreGateway;
  let findStoreByIdUseCase: FindStoreByIdUseCase;
  let mockGeneralDataSource: jest.Mocked<GeneralDataSource>;

  beforeEach(() => {
    // Create mock data sources
    mockGeneralDataSource = createMockGeneralDataSource();

    const mockNotificationDataSource = createMockNotificationDataSource();

    const fakePaymentDataSource = new FakePaymentDataSource();
    const dataSource = new DataSourceProxy(
      mockGeneralDataSource,
      fakePaymentDataSource,
      mockNotificationDataSource,
    );

    storeGateway = new StoreGateway(dataSource);
    findStoreByIdUseCase = new FindStoreByIdUseCase(storeGateway);
    useCase = new AddTotemUseCase(storeGateway, findStoreByIdUseCase);
  });

  it('should add a totem to a store', async () => {
    const totemName = 'New Totem';

    const store = Store.create({
      name: 'Store Name',
      fantasyName: 'Fantasy Name',
      email: Email.create('email@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    // Configure mock to return the store data
    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      totems: [],
    };

    mockGeneralDataSource.findStoreById.mockResolvedValue(mockStoreDTO);
    mockGeneralDataSource.saveStore.mockResolvedValue(undefined);

    const result = await useCase.execute({
      storeId: store.value!.id,
      totemName,
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Totem);
  });

  it('should fail to create a totem if the store does not exist', async () => {
    const storeId = 'non-existent-store-id';
    const totemName = 'New Totem';

    // Configure mock to return null for non-existing store
    mockGeneralDataSource.findStoreById.mockResolvedValue(null);

    const result = await useCase.execute({ storeId, totemName });

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Store not found');
  });

  it('should fail to create a totem if a totem with the same name already exists', async () => {
    const totemName = 'Existing Totem';

    const totem = Totem.create({ name: totemName });

    const store = Store.create({
      name: 'Store Name',
      fantasyName: 'Fantasy Name',
      email: Email.create('email@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    store.value!.addTotem(totem.value!);

    // Configure mock to return store with existing totem
    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Store Name',
      fantasy_name: 'Fantasy Name',
      email: 'email@example.com',
      cnpj: '11222333000181',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      totems: [
        {
          id: totem.value!.id,
          name: totemName,
          token_access: totem.value!.tokenAccess,
          status: 'active',
          created_at: new Date().toISOString(),
        },
      ],
    };

    mockGeneralDataSource.findStoreById.mockResolvedValue(mockStoreDTO);

    const result = await useCase.execute({
      storeId: store.value!.id,
      totemName,
    });

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe('Totem with this name already exists');
  });
});
