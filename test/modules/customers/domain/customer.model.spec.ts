import { CustomerModel } from '../../../../src/modules/customers/models/domain/customer.model';

describe('CustomerModel (Domain)', () => {
  it('should create a valid customer using fromProps', () => {
    const now = new Date();
    const customer = CustomerModel.fromProps({
      id: '1',
      cpf: '12345678900',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: now,
      updatedAt: now,
    });
    expect(customer.id).toBe('1');
    expect(customer.cpf).toBe('12345678900');
    expect(customer.name).toBe('Test User');
    expect(customer.email).toBe('test@example.com');
    expect(customer.created_at).toBe(now);
    expect(customer.updated_at).toBe(now);
  });

  it('should throw if required fields are missing (fromProps)', () => {
    const now = new Date();
    expect(() =>
      CustomerModel.fromProps({
        id: '',
        cpf: '12345678900',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('ID is required');
    expect(() =>
      CustomerModel.fromProps({
        id: '1',
        cpf: '',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('CPF is required');
    expect(() =>
      CustomerModel.fromProps({
        id: '1',
        cpf: '12345678900',
        name: '',
        email: 'test@example.com',
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('Name is required');
    expect(() =>
      CustomerModel.fromProps({
        id: '1',
        cpf: '12345678900',
        name: 'Test User',
        email: '',
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('Email is required');
  });

  it('should create a valid customer using create', () => {
    const customer = CustomerModel.create({
      cpf: '12345678900',
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(customer.id).toBeDefined();
    expect(customer.cpf).toBe('12345678900');
    expect(customer.name).toBe('Test User');
    expect(customer.email).toBe('test@example.com');
    expect(customer.created_at).toBeInstanceOf(Date);
    expect(customer.updated_at).toBeInstanceOf(Date);
  });

  it('should throw if required fields are missing (create)', () => {
    expect(() =>
      CustomerModel.create({
        cpf: '',
        name: 'Test User',
        email: 'test@example.com',
      }),
    ).toThrow('CPF is required');
    expect(() =>
      CustomerModel.create({
        cpf: '12345678900',
        name: '',
        email: 'test@example.com',
      }),
    ).toThrow('Name is required');
    expect(() =>
      CustomerModel.create({
        cpf: '12345678900',
        name: 'Test User',
        email: '',
      }),
    ).toThrow('Email is required');
  });
});
