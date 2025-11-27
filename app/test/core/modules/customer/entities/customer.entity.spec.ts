import { Customer } from 'src/core/modules/customer/entities/customer.entity';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';

describe('Customer Entity Tests', () => {
  describe('Customer Creation', () => {
    it('should create a customer with valid data', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.create({
        cpf: cpf!,
        name: 'João Silva',
        email: email!,
      });

      expect(error).toBeUndefined();
      expect(customer).toBeDefined();
      expect(customer!.name).toBe('João Silva');
      expect(customer!.cpf.toString()).toBe('11144477735');
      expect(customer!.email.toString()).toBe('test@example.com');
      expect(customer!.id).toBeDefined();
      expect(customer!.createdAt).toBeDefined();
      expect(customer!.updatedAt).toBeDefined();
    });

    it('should fail to create customer with empty name', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.create({
        cpf: cpf!,
        name: '',
        email: email!,
      });

      expect(error).toBeDefined();
      expect(customer).toBeUndefined();
      expect(error?.message).toContain('name');
    });

    it('should fail to create customer with name containing only whitespace', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.create({
        cpf: cpf!,
        name: '   ',
        email: email!,
      });

      expect(error).toBeDefined();
      expect(customer).toBeUndefined();
      expect(error?.message).toContain('name');
    });

    it('should trim customer name when creating', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.create({
        cpf: cpf!,
        name: '  João Silva  ',
        email: email!,
      });

      expect(error).toBeUndefined();
      expect(customer).toBeDefined();
      expect(customer!.name).toBe('João Silva');
    });
  });

  describe('Customer Restoration', () => {
    it('should restore a customer from valid data', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const now = new Date();
      const { error, value: customer } = Customer.restore({
        id: 'test-id-123',
        cpf: cpf!,
        name: 'João Silva',
        email: email!,
        createdAt: now,
        updatedAt: now,
      });

      expect(error).toBeUndefined();
      expect(customer).toBeDefined();
      expect(customer!.id).toBe('test-id-123');
      expect(customer!.name).toBe('João Silva');
      expect(customer!.cpf.toString()).toBe('11144477735');
      expect(customer!.email.toString()).toBe('test@example.com');
      expect(customer!.createdAt).toBe(now);
      expect(customer!.updatedAt).toBe(now);
    });

    it('should fail to restore customer with invalid data', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.restore({
        id: '',
        cpf: cpf!,
        name: 'João Silva',
        email: email!,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(error).toBeDefined();
      expect(customer).toBeUndefined();
    });
  });

  describe('Customer Getters', () => {
    it('should return correct property values', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.create({
        cpf: cpf!,
        name: 'João Silva',
        email: email!,
      });

      expect(error).toBeUndefined();
      expect(customer).toBeDefined();

      expect(customer!.id).toBeDefined();
      expect(typeof customer!.id).toBe('string');
      expect(customer!.cpf).toBe(cpf);
      expect(customer!.name).toBe('João Silva');
      expect(customer!.email).toBe(email);
      expect(customer!.createdAt).toBeInstanceOf(Date);
      expect(customer!.updatedAt).toBeInstanceOf(Date);
    });
  });
});
