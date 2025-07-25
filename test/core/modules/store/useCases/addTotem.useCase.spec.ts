import { ResourceConflictException } from 'src-clean/common/exceptions/resourceConflictException';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { Store } from 'src-clean/core/modules/store/entities/store.entity';
import { Totem } from 'src-clean/core/modules/store/entities/totem.entity';
import { StoreGateway } from 'src-clean/core/modules/store/gateways/store.gateway';
import { AddTotemUseCase } from 'src-clean/core/modules/store/useCases/addTotem.useCase';
import { FindStoreByIdUseCase } from 'src-clean/core/modules/store/useCases/findStoreById.useCase';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src-clean/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';
import { NotificationDataSource } from 'src-clean/external/dataSources/notification/notification.dataSource';

describe('AddTotemUseCase', () => {
  let useCase: AddTotemUseCase;
  let storeGateway: StoreGateway;
  let findStoreByIdUseCase: FindStoreByIdUseCase;

  beforeEach(() => {
    const mockGeneralDataSource: jest.Mocked<GeneralDataSource> = {
      findStoreByEmail: jest.fn(),
      findStoreByCnpj: jest.fn(),
      findStoreByName: jest.fn(),
      findStoreById: jest.fn(),
      saveStore: jest.fn(),
      findStoreByTotemAccessToken: jest.fn(),
      findAllCategoriesByStoreId: jest.fn(),
      saveCategory: jest.fn(),
      findCategoryById: jest.fn(),
      findCategoryByNameAndStoreId: jest.fn(),
      findProductsById: jest.fn(),
      savePayment: jest.fn(),
      findPaymentById: jest.fn(),
      findCustomerById: jest.fn(),
      findCustomerByCpf: jest.fn(),
      findCustomerByEmail: jest.fn(),
      findAllCustomers: jest.fn(),
      saveCustomer: jest.fn(),
      deleteCustomer: jest.fn(),
      saveOrder: jest.fn(),
      deleteOrder: jest.fn(),
      deleteOrderItem: jest.fn(),
      getAllOrders: jest.fn(),
      findOrderById: jest.fn(),
      findByOrderItemId: jest.fn(),
      getFilteredAndSortedOrders: jest.fn(),
      saveNotification: jest.fn(),
    };

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
