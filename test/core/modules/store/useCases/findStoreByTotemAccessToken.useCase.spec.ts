import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { Store } from 'src-clean/core/modules/store/entities/store.entity';
import { Totem } from 'src-clean/core/modules/store/entities/totem.entity';
import { StoreGateway } from 'src-clean/core/modules/store/gateways/store.gateway';
import { FindStoreByTotemAccessTokenUseCase } from 'src-clean/core/modules/store/useCases/findStoreByTotemAccessToken.useCase';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { InMemoryGeneralDataSource } from 'src-clean/external/dataSources/general/inMemory/inMemoryGeneralDataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';

describe('FindStoreByTotemAccessTokenUseCase', () => {
  let useCase: FindStoreByTotemAccessTokenUseCase;
  let storeGateway: StoreGateway;
  let dataSource: DataSourceProxy;

  beforeEach(() => {
    const inMemoryDataSource = new InMemoryGeneralDataSource();
    const fakePaymentDataSource = new FakePaymentDataSource();
    dataSource = new DataSourceProxy(inMemoryDataSource, fakePaymentDataSource);

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

    await storeGateway.saveStore(store.value!);

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

    await storeGateway.saveStore(store1.value!);
    await storeGateway.saveStore(store2.value!);

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

    // Add multiple totems to the store
    const totem1 = Totem.create({ name: 'First Totem' });
    const totem2 = Totem.create({ name: 'Second Totem' });
    const totem3 = Totem.create({ name: 'Third Totem' });

    store.value!.addTotem(totem1.value!);
    store.value!.addTotem(totem2.value!);
    store.value!.addTotem(totem3.value!);

    await storeGateway.saveStore(store.value!);

    // Find each totem individually
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

    await storeGateway.saveStore(store.value!);

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

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute(totem.value!.tokenAccess);

    expect(result.error).toBeUndefined();
    expect(result.value!.name).toBe(store.value!.name);
    expect(result.value!.totems).toHaveLength(1);
    expect(result.value!.totems[0].name).toBe(specialTotemName);
  });
});
