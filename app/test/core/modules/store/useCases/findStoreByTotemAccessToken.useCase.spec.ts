import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { Totem } from 'src/core/modules/store/entities/totem.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { FindStoreByTotemAccessTokenUseCase } from 'src/core/modules/store/useCases/findStoreByTotemAccessToken.useCase';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';
import { NotificationDataSource } from 'src/external/dataSources/notification/notification.dataSource';
import { createMockGeneralDataSource } from '../../../mock/generalDataSource.mock';

describe('FindStoreByTotemAccessTokenUseCase', () => {
  let useCase: FindStoreByTotemAccessTokenUseCase;
  let storeGateway: StoreGateway;
  let dataSource: DataSourceProxy;
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
    dataSource = new DataSourceProxy(
      mockGeneralDataSource,
      fakePaymentDataSource,
      mockNotificationDataSource,
    );

    storeGateway = new StoreGateway(dataSource);
    useCase = new FindStoreByTotemAccessTokenUseCase(storeGateway);
  });

  it('should find totem successfully by access token', async () => {
    const store = Store.create({
      name: 'Test Store',
      fantasyName: 'Test Fantasy Store',
      email: Email.create('store@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    const totem = Totem.create({ name: 'Test Totem' });
    store.value!.addTotem(totem.value!);

    // Mock the store with totem
    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Test Store',
      fantasy_name: 'Test Fantasy Store',
      email: 'store@example.com',
      cnpj: '11222333000181',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      phone: '5511999999999',
      created_at: store.value!.createdAt.toISOString(),
      totems: [
        {
          id: totem.value!.id,
          name: 'Test Totem',
          token_access: totem.value!.tokenAccess,
          status: 'active',
          created_at: totem.value!.createdAt.toISOString(),
        },
      ],
    };

    mockGeneralDataSource.findStoreByTotemAccessToken.mockResolvedValue(
      mockStoreDTO,
    );

    const result = await useCase.execute(totem.value!.tokenAccess);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.id).toBe(store.value!.id);
    expect(result.value!.name).toBe('Test Store');
    expect(result.value!.createdAt).toBeInstanceOf(Date);
    expect(result.value!.totems).toHaveLength(1);
    expect(result.value!.totems[0].id).toBe(totem.value!.id);
    expect(result.value!.totems[0].name).toBe(totem.value!.name);
    expect(result.value!.totems[0].tokenAccess).toBe(totem.value!.tokenAccess);
    expect(result.value!.totems[0].createdAt).toBeInstanceOf(Date);
  });

  it('should return ResourceNotFoundException for non-existing totem', async () => {
    mockGeneralDataSource.findStoreByTotemAccessToken.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-totem-access-token');

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Store not found');
    expect(result.value).toBeUndefined();
  });

  it('should find totem from multiple stores', async () => {
    const store1 = Store.create({
      name: 'Store 1',
      fantasyName: 'Fantasy Store 1',
      email: Email.create('store1@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    const totem1 = Totem.create({ name: 'Totem 1' });
    store1.value!.addTotem(totem1.value!);

    const store2 = Store.create({
      name: 'Store 2',
      fantasyName: 'Fantasy Store 2',
      email: Email.create('store2@example.com').value!,
      cnpj: CNPJ.create('75914784000162').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5592999999999').value!,
    });

    const totem2 = Totem.create({ name: 'Totem 2' });
    store2.value!.addTotem(totem2.value!);

    // Mock store 1 with totem 1
    const mockStore1DTO = {
      id: store1.value!.id,
      name: 'Store 1',
      fantasy_name: 'Fantasy Store 1',
      email: 'store1@example.com',
      cnpj: '11222333000181',
      salt: store1.value!.salt,
      password_hash: store1.value!.passwordHash,
      phone: '5511999999999',
      created_at: store1.value!.createdAt.toISOString(),
      totems: [
        {
          id: totem1.value!.id,
          name: 'Totem 1',
          token_access: totem1.value!.tokenAccess,
          status: 'active',
          created_at: totem1.value!.createdAt.toISOString(),
        },
      ],
    };

    // Mock store 2 with totem 2
    const mockStore2DTO = {
      id: store2.value!.id,
      name: 'Store 2',
      fantasy_name: 'Fantasy Store 2',
      email: 'store2@example.com',
      cnpj: '75914784000162',
      salt: store2.value!.salt,
      password_hash: store2.value!.passwordHash,
      phone: '5592999999999',
      created_at: store2.value!.createdAt.toISOString(),
      totems: [
        {
          id: totem2.value!.id,
          name: 'Totem 2',
          token_access: totem2.value!.tokenAccess,
          status: 'active',
          created_at: totem2.value!.createdAt.toISOString(),
        },
      ],
    };

    mockGeneralDataSource.findStoreByTotemAccessToken
      .mockResolvedValueOnce(mockStore1DTO)
      .mockResolvedValueOnce(mockStore2DTO);

    const result1 = await useCase.execute(totem1.value!.tokenAccess);
    expect(result1.error).toBeUndefined();
    expect(result1.value!.name).toBe('Store 1');
    expect(result1.value!.totems).toHaveLength(1);
    expect(result1.value!.totems[0].name).toBe('Totem 1');
    expect(result1.value!.totems[0].tokenAccess).toBe(
      totem1.value!.tokenAccess,
    );
    expect(result1.value!.totems[0].createdAt).toBeInstanceOf(Date);

    const result2 = await useCase.execute(totem2.value!.tokenAccess);
    expect(result2.error).toBeUndefined();
    expect(result2.value!.name).toBe('Store 2');
    expect(result2.value!.totems).toHaveLength(1);
    expect(result2.value!.totems[0].name).toBe('Totem 2');
    expect(result2.value!.totems[0].tokenAccess).toBe(
      totem2.value!.tokenAccess,
    );
    expect(result2.value!.totems[0].createdAt).toBeInstanceOf(Date);
  });

  it('should find totem when store has multiple totems', async () => {
    const store = Store.create({
      name: 'Multi Totem Store',
      fantasyName: 'Multi Totem Fantasy',
      email: Email.create('multi@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    const totem1 = Totem.create({ name: 'First Totem' });
    const totem2 = Totem.create({ name: 'Second Totem' });
    const totem3 = Totem.create({ name: 'Third Totem' });

    store.value!.addTotem(totem1.value!);
    store.value!.addTotem(totem2.value!);
    store.value!.addTotem(totem3.value!);

    // Mock store with multiple totems
    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Multi Totem Store',
      fantasy_name: 'Multi Totem Fantasy',
      email: 'multi@example.com',
      cnpj: '11222333000181',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      phone: '5511999999999',
      created_at: store.value!.createdAt.toISOString(),
      totems: [
        {
          id: totem1.value!.id,
          name: 'First Totem',
          token_access: totem1.value!.tokenAccess,
          status: 'active',
          created_at: totem1.value!.createdAt.toISOString(),
        },
        {
          id: totem2.value!.id,
          name: 'Second Totem',
          token_access: totem2.value!.tokenAccess,
          status: 'active',
          created_at: totem2.value!.createdAt.toISOString(),
        },
        {
          id: totem3.value!.id,
          name: 'Third Totem',
          token_access: totem3.value!.tokenAccess,
          status: 'active',
          created_at: totem3.value!.createdAt.toISOString(),
        },
      ],
    };

    mockGeneralDataSource.findStoreByTotemAccessToken
      .mockResolvedValueOnce(mockStoreDTO)
      .mockResolvedValueOnce(mockStoreDTO)
      .mockResolvedValueOnce(mockStoreDTO);

    const result1 = await useCase.execute(totem1.value!.tokenAccess);
    expect(result1.error).toBeUndefined();
    expect(result1.value!.name).toBe('Multi Totem Store');
    expect(result1.value!.totems).toHaveLength(3);
    expect(result1.value!.totems[0].name).toBe('First Totem');
    expect(result1.value!.totems[0].tokenAccess).toBe(
      totem1.value!.tokenAccess,
    );
    expect(result1.value!.totems[0].createdAt).toBeInstanceOf(Date);
    expect(result1.value!.totems[1].name).toBe('Second Totem');
    expect(result1.value!.totems[1].tokenAccess).toBe(
      totem2.value!.tokenAccess,
    );
    expect(result1.value!.totems[1].createdAt).toBeInstanceOf(Date);
    expect(result1.value!.totems[2].name).toBe('Third Totem');
    expect(result1.value!.totems[2].tokenAccess).toBe(
      totem3.value!.tokenAccess,
    );
    expect(result1.value!.totems[2].createdAt).toBeInstanceOf(Date);

    const result2 = await useCase.execute(totem2.value!.tokenAccess);
    expect(result2.error).toBeUndefined();
    expect(result2.value!.name).toBe('Multi Totem Store');
    expect(result2.value!.totems).toHaveLength(3);
    expect(result2.value!.totems[0].name).toBe('First Totem');
    expect(result2.value!.totems[0].tokenAccess).toBe(
      totem1.value!.tokenAccess,
    );
    expect(result2.value!.totems[0].createdAt).toBeInstanceOf(Date);
    expect(result2.value!.totems[1].name).toBe('Second Totem');
    expect(result2.value!.totems[1].tokenAccess).toBe(
      totem2.value!.tokenAccess,
    );
    expect(result2.value!.totems[1].createdAt).toBeInstanceOf(Date);
    expect(result2.value!.totems[2].name).toBe('Third Totem');
    expect(result2.value!.totems[2].tokenAccess).toBe(
      totem3.value!.tokenAccess,
    );
    expect(result2.value!.totems[2].createdAt).toBeInstanceOf(Date);

    const result3 = await useCase.execute(totem3.value!.tokenAccess);
    expect(result3.error).toBeUndefined();
    expect(result3.value!.name).toBe('Multi Totem Store');
    expect(result3.value!.totems).toHaveLength(3);
    expect(result3.value!.totems[0].name).toBe('First Totem');
    expect(result3.value!.totems[0].tokenAccess).toBe(
      totem1.value!.tokenAccess,
    );
    expect(result3.value!.totems[0].createdAt).toBeInstanceOf(Date);
    expect(result3.value!.totems[1].name).toBe('Second Totem');
    expect(result3.value!.totems[1].tokenAccess).toBe(
      totem2.value!.tokenAccess,
    );
    expect(result3.value!.totems[1].createdAt).toBeInstanceOf(Date);
    expect(result3.value!.totems[2].name).toBe('Third Totem');
    expect(result3.value!.totems[2].tokenAccess).toBe(
      totem3.value!.tokenAccess,
    );
    expect(result3.value!.totems[2].createdAt).toBeInstanceOf(Date);
  });

  it('should handle empty totem access token', async () => {
    const result = await useCase.execute('');

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Store not found');
    expect(result.value).toBeUndefined();
  });

  it('should return complete totem entity with all properties', async () => {
    const store = Store.create({
      name: 'Complete Test Store',
      fantasyName: 'Complete Fantasy Store',
      email: Email.create('complete@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    const totemName = 'Complete Test Totem';
    const totem = Totem.create({ name: totemName });
    store.value!.addTotem(totem.value!);

    // Mock complete store with totem
    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Complete Test Store',
      fantasy_name: 'Complete Fantasy Store',
      email: 'complete@example.com',
      cnpj: '11222333000181',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      phone: '5511999999999',
      created_at: store.value!.createdAt.toISOString(),
      totems: [
        {
          id: totem.value!.id,
          name: totemName,
          token_access: totem.value!.tokenAccess,
          status: 'active',
          created_at: totem.value!.createdAt.toISOString(),
        },
      ],
    };

    mockGeneralDataSource.findStoreByTotemAccessToken.mockResolvedValue(
      mockStoreDTO,
    );

    const result = await useCase.execute(totem.value!.tokenAccess);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);

    const foundStore = result.value!;
    expect(foundStore.id).toBe(store.value!.id);
    expect(foundStore.name).toBe(store.value!.name);
    expect(foundStore.createdAt).toBeInstanceOf(Date);
    expect(foundStore.createdAt.getTime()).toBe(
      store.value!.createdAt.getTime(),
    );
    expect(foundStore.totems).toHaveLength(1);
    expect(foundStore.totems[0].name).toBe(totemName);
    expect(foundStore.totems[0].tokenAccess).toBe(totem.value!.tokenAccess);
    expect(foundStore.totems[0].createdAt).toBeInstanceOf(Date);
    expect(foundStore.totems[0].createdAt.getTime()).toBe(
      totem.value!.createdAt.getTime(),
    );
  });

  it('should find totem with special characters in name', async () => {
    const store = Store.create({
      name: 'Special Store',
      fantasyName: 'Special Fantasy',
      email: Email.create('special@example.com').value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    const specialTotemName = 'Totem-123_Special@Name!';
    const totem = Totem.create({ name: specialTotemName });
    store.value!.addTotem(totem.value!);

    // Mock store with special character totem
    const mockStoreDTO = {
      id: store.value!.id,
      name: 'Special Store',
      fantasy_name: 'Special Fantasy',
      email: 'special@example.com',
      cnpj: '11222333000181',
      salt: store.value!.salt,
      password_hash: store.value!.passwordHash,
      phone: '5511999999999',
      created_at: store.value!.createdAt.toISOString(),
      totems: [
        {
          id: totem.value!.id,
          name: specialTotemName,
          token_access: totem.value!.tokenAccess,
          status: 'active',
          created_at: totem.value!.createdAt.toISOString(),
        },
      ],
    };

    mockGeneralDataSource.findStoreByTotemAccessToken.mockResolvedValue(
      mockStoreDTO,
    );

    const result = await useCase.execute(totem.value!.tokenAccess);

    expect(result.error).toBeUndefined();
    expect(result.value!.name).toBe(store.value!.name);
    expect(result.value!.totems).toHaveLength(1);
    expect(result.value!.totems[0].name).toBe(specialTotemName);
  });
});
