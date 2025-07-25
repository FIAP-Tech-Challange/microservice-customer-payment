import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { Store } from 'src-clean/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src-clean/core/modules/store/gateways/store.gateway';
import { FindStoreByEmailUseCase } from 'src-clean/core/modules/store/useCases/findStoreByEmail.useCase';
import { ValidateStorePasswordUseCase } from 'src-clean/core/modules/store/useCases/validateStorePassword.useCase';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { GeneralDataSource } from 'src-clean/external/dataSources/general/general.dataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';
import { NotificationDataSource } from 'src-clean/external/dataSources/notification/notification.dataSource';

describe('ValidateStorePasswordUseCase', () => {
  let useCase: ValidateStorePasswordUseCase;
  let storeGateway: StoreGateway;
  let findStoreByEmailUseCase: FindStoreByEmailUseCase;

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
    findStoreByEmailUseCase = new FindStoreByEmailUseCase(storeGateway);
    useCase = new ValidateStorePasswordUseCase(findStoreByEmailUseCase);
  });

  it('should validate password successfully for existing store with correct password', async () => {
    const email = 'email@example.com';
    const password = 'password123';

    const store = Store.create({
      name: 'Store Name',
      fantasyName: 'Fantasy Name',
      email: Email.create(email).value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: password,
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute({
      email,
      password,
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBe(true);
  });

  it('should return false for existing store with incorrect password', async () => {
    const email = 'email@example.com';
    const correctPassword = 'password123';
    const incorrectPassword = 'wrongpassword';

    const store = Store.create({
      name: 'Store Name',
      fantasyName: 'Fantasy Name',
      email: Email.create(email).value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: correctPassword,
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute({
      email,
      password: incorrectPassword,
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBe(false);
  });

  it('should fail to validate password for non-existing store', async () => {
    const result = await useCase.execute({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Store not found');
    expect(result.value).toBeUndefined();
  });

  it('should fail to validate password with invalid email format', async () => {
    const result = await useCase.execute({
      email: 'invalid-email',
      password: 'password123',
    });

    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error!.message).toBe('Invalid email address');
    expect(result.value).toBeUndefined();
  });

  it('should validate password successfully with different valid email formats', async () => {
    const emails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'admin+test@company.org',
    ];

    for (const email of emails) {
      const password = 'password123';

      const store = Store.create({
        name: `Store ${email}`,
        fantasyName: `Fantasy ${email}`,
        email: Email.create(email).value!,
        cnpj: CNPJ.create('11222333000181').value!,
        plainPassword: password,
        phone: BrazilianPhone.create('5511999999999').value!,
      });

      await storeGateway.saveStore(store.value!);

      const result = await useCase.execute({
        email,
        password,
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBe(true);
    }
  });

  it('should handle empty password correctly', async () => {
    const email = 'email@example.com';
    const password = 'password123';

    const store = Store.create({
      name: 'Store Name',
      fantasyName: 'Fantasy Name',
      email: Email.create(email).value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: password,
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute({
      email,
      password: '',
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBe(false);
  });
});
