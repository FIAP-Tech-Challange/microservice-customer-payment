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
import { InMemoryGeneralDataSource } from 'src/external/dataSources/general/inMemory/inMemoryGeneralDataSource';
import { FakePaymentDataSource } from 'src/external/dataSources/payment/fake/fakePaymentDataSource';

describe('AddTotemUseCase', () => {
  let useCase: AddTotemUseCase;
  let storeGateway: StoreGateway;
  let findStoreByIdUseCase: FindStoreByIdUseCase;

  beforeEach(() => {
    const inMemoryDataSource = new InMemoryGeneralDataSource();
    const fakePaymentDataSource = new FakePaymentDataSource();
    const dataSource = new DataSourceProxy(
      inMemoryDataSource,
      fakePaymentDataSource,
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

    await storeGateway.saveStore(store.value!);

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

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute({
      storeId: store.value!.id,
      totemName,
    });

    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error!.message).toBe('Totem with this name already exists');
  });
});
