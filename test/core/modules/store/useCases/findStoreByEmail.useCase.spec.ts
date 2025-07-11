import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { Store } from 'src-clean/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src-clean/core/modules/store/gateways/store.gateway';
import { FindStoreByEmailUseCase } from 'src-clean/core/modules/store/useCases/findStoreByEmail.useCase';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { InMemoryGeneralDataSource } from 'src-clean/external/dataSources/general/inMemory/inMemoryGeneralDataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';

describe('FindStoreByEmailUseCase', () => {
  let useCase: FindStoreByEmailUseCase;
  let storeGateway: StoreGateway;

  beforeEach(() => {
    const inMemoryDataSource = new InMemoryGeneralDataSource();
    const fakePaymentDataSource = new FakePaymentDataSource();
    const dataSource = new DataSourceProxy(
      inMemoryDataSource,
      fakePaymentDataSource,
    );

    storeGateway = new StoreGateway(dataSource);
    useCase = new FindStoreByEmailUseCase(storeGateway);
  });

  it('should find store successfully by email', async () => {
    const email = 'store@example.com';

    const store = Store.create({
      name: 'Test Store',
      fantasyName: 'Test Fantasy Store',
      email: Email.create(email).value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute(email);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.email.toString()).toBe(email);
    expect(result.value!.name).toBe('Test Store');
    expect(result.value!.fantasyName).toBe('Test Fantasy Store');
    expect(result.value!.cnpj.toString()).toBe('11222333000181');
    expect(result.value!.phone.toString()).toBe('5511999999999');
  });

  it('should return ResourceNotFoundException for non-existing store', async () => {
    const result = await useCase.execute('nonexistent@example.com');

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error!.message).toBe('Store not found');
    expect(result.value).toBeUndefined();
  });

  it('should return ResourceInvalidException for invalid email format', async () => {
    const result = await useCase.execute('invalid-email');

    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error!.message).toBe('Invalid email address');
    expect(result.value).toBeUndefined();
  });

  it('should handle email normalization correctly', async () => {
    const originalEmail = 'Test.Store@Example.COM';
    const normalizedEmail = 'test.store@example.com';

    const store = Store.create({
      name: 'Test Store',
      fantasyName: 'Test Fantasy Store',
      email: Email.create(originalEmail).value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    await storeGateway.saveStore(store.value!);

    // Should find store with normalized email
    const result = await useCase.execute(normalizedEmail);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.email.toString()).toBe(normalizedEmail);
  });

  it('should handle email with whitespace correctly', async () => {
    const emailWithSpaces = '   store@example.com   ';
    const trimmedEmail = 'store@example.com';

    const store = Store.create({
      name: 'Test Store',
      fantasyName: 'Test Fantasy Store',
      email: Email.create(trimmedEmail).value!,
      cnpj: CNPJ.create('11222333000181').value!,
      plainPassword: 'password123',
      phone: BrazilianPhone.create('5511999999999').value!,
    });

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute(emailWithSpaces);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.email.toString()).toBe(trimmedEmail);
  });

  it('should find stores with different valid email formats', async () => {
    const emails = [
      'simple@example.com',
      'user.name@domain.co.uk',
      'admin+test@company.org',
      'user123@subdomain.example.com',
    ];

    // Create stores with different email formats
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const store = Store.create({
        name: `Store ${i + 1}`,
        fantasyName: `Fantasy Store ${i + 1}`,
        email: Email.create(email).value!,
        cnpj: CNPJ.create('11222333000181').value!,
        plainPassword: 'password123',
        phone: BrazilianPhone.create('5511999999999').value!,
      });

      await storeGateway.saveStore(store.value!);
    }

    // Test finding each store
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const result = await useCase.execute(email);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeInstanceOf(Store);
      expect(result.value!.email.toString()).toBe(email);
      expect(result.value!.name).toBe(`Store ${i + 1}`);
    }
  });

  it('should handle various invalid email formats', async () => {
    const invalidEmails = [
      '',
      'invalid',
      'invalid@',
      '@invalid.com',
      'invalid.email',
      'invalid@.com',
      'invalid@com',
      'invalid..email@example.com',
      'invalid@example..com',
    ];

    for (const invalidEmail of invalidEmails) {
      const result = await useCase.execute(invalidEmail);

      expect(result.error).toBeInstanceOf(ResourceInvalidException);
      expect(result.error!.message).toBe('Invalid email address');
      expect(result.value).toBeUndefined();
    }
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

    await storeGateway.saveStore(store.value!);

    const result = await useCase.execute(email);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);

    const foundStore = result.value!;
    expect(foundStore.id).toBeDefined();
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
