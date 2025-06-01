import { CustomerModel } from '../../../../src/modules/customers/models/domain/customer.model';
import { CPF } from '../../../../src/shared/domain/cpf.vo';
import { Email } from '../../../../src/shared/domain/email.vo';

describe('CustomerModel (Domain)', () => {
  it('should create a valid customer using fromProps', () => {
    const now = new Date();
    const customer = CustomerModel.fromProps({
      id: '1',
      cpf: new CPF('90213691094'),
      name: 'Test User',
      email: new Email('test@example.com'),
      createdAt: now,
      updatedAt: now,
    });
    expect(customer.id).toBe('1');
    expect(customer.cpf).toBeInstanceOf(CPF);
    expect(customer.name).toBe('Test User');
    expect(customer.email).toBeInstanceOf(Email);
  });

  it('should throw if required fields are missing (fromProps)', () => {
    const now = new Date();
    expect(() =>
      CustomerModel.fromProps({
        id: '',
        cpf: new CPF('90213691094'),
        name: 'Test User',
        email: new Email('test@example.com'),
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('ID is required');
    expect(() =>
      CustomerModel.fromProps({
        id: '1',
        cpf: null as unknown as CPF,
        name: 'Test User',
        email: new Email('test@example.com'),
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('CPF is required');
    expect(() =>
      CustomerModel.fromProps({
        id: '1',
        cpf: new CPF('90213691094'),
        name: '',
        email: new Email('test@example.com'),
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('Name is required');
    expect(() =>
      CustomerModel.fromProps({
        id: '1',
        cpf: new CPF('90213691094'),
        name: 'Test User',
        email: null as unknown as Email,
        createdAt: now,
        updatedAt: now,
      }),
    ).toThrow('Email is required');
  });

  it('should create a valid customer using create', () => {
    const customer = CustomerModel.create({
      cpf: new CPF('90213691094'),
      name: 'Test User',
      email: new Email('test@example.com'),
    });
    expect(customer.id).toBeDefined();
    expect(customer.cpf).toBeInstanceOf(CPF);
    expect(customer.name).toBe('Test User');
    expect(customer.email).toBeInstanceOf(Email);
  });

  it('should throw if required fields are missing (create)', () => {
    expect(() =>
      CustomerModel.create({
        cpf: null as unknown as CPF,
        name: 'Test User',
        email: new Email('test@example.com'),
      }),
    ).toThrow('CPF is required');
    expect(() =>
      CustomerModel.create({
        cpf: new CPF('90213691094'),
        name: '',
        email: new Email('test@example.com'),
      }),
    ).toThrow('Name is required');
    expect(() =>
      CustomerModel.create({
        cpf: new CPF('90213691094'),
        name: 'Test User',
        email: null as unknown as Email,
      }),
    ).toThrow('Email is required');
  });
});
