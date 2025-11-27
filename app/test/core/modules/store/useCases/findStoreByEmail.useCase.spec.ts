import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Store } from 'src/core/modules/store/entities/store.entity';
import { StoreGateway } from 'src/core/modules/store/gateways/store.gateway';
import { FindStoreByEmailUseCase } from 'src/core/modules/store/useCases/findStoreByEmail.useCase';
import { DataSource } from 'src/common/dataSource/dataSource.interface';

describe('FindStoreByEmailUseCase', () => {
  let useCase: FindStoreByEmailUseCase;
  let storeGateway: StoreGateway;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockDataSource = {
      findStoreByEmail: jest.fn(),
      saveStore: jest.fn(),
    };

    storeGateway = new StoreGateway(mockDataSource as DataSource);
    useCase = new FindStoreByEmailUseCase(storeGateway);
  });

  it('should find store successfully by email', async () => {
    const email = 'store@example.com';

    const mockStoreDTO = {
      id: 'store-123',
      name: 'Test Store',
      fantasy_name: 'Test Fantasy Store',
      email: email,
      cnpj: '11222333000181',
      salt: 'test_salt',
      password_hash: 'hashed_password',
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(
      mockStoreDTO,
    );

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
    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(null);

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
    const normalizedEmail = 'test.store@example.com';

    const mockStoreDTO = {
      id: 'store-123',
      name: 'Test Store',
      fantasy_name: 'Test Fantasy Store',
      email: normalizedEmail,
      cnpj: '11222333000181',
      salt: 'test_salt',
      password_hash: 'hashed_password',
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(
      mockStoreDTO,
    );

    const result = await useCase.execute(normalizedEmail);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeInstanceOf(Store);
    expect(result.value!.email.toString()).toBe(normalizedEmail);
  });

  it('should handle email with whitespace correctly', async () => {
    const emailWithSpaces = '   store@example.com   ';
    const trimmedEmail = 'store@example.com';

    const mockStoreDTO = {
      id: 'store-123',
      name: 'Test Store',
      fantasy_name: 'Test Fantasy Store',
      email: trimmedEmail,
      cnpj: '11222333000181',
      salt: 'test_salt',
      password_hash: 'hashed_password',
      phone: '5511999999999',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(
      mockStoreDTO,
    );

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

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      const mockStoreDTO = {
        id: `store-${i}`,
        name: `Store ${i + 1}`,
        fantasy_name: `Fantasy Store ${i + 1}`,
        email: email,
        cnpj: '11222333000181',
        salt: 'test_salt',
        password_hash: 'hashed_password',
        phone: '5511999999999',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        totems: [],
      };

      (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(
        mockStoreDTO,
      );

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

    const mockStoreDTO = {
      id: 'store-complete',
      name: storeName,
      fantasy_name: fantasyName,
      email: email,
      cnpj: cnpj,
      salt: 'test_salt',
      password_hash: 'hashed_password',
      phone: phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      totems: [],
    };

    (mockDataSource.findStoreByEmail as jest.Mock).mockResolvedValue(
      mockStoreDTO,
    );

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
