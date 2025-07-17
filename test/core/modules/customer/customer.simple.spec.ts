import { Customer } from 'src-clean/core/modules/customer/entities/customer.entity';
import { CustomerMapper } from 'src-clean/core/modules/customer/mappers/customer.mapper';
import { CPF } from 'src-clean/core/common/valueObjects/cpf.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { CustomerDataSourceDTO } from 'src-clean/common/dataSource/DTOs/customerDataSource.dto';
import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';

describe('Customer Core Tests', () => {
  describe('Customer Entity', () => {
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

    it('should fail to create customer with invalid CPF', () => {
      const { error: cpfError, value: cpf } = CPF.create('invalid-cpf');

      expect(cpfError).toBeDefined();
      expect(cpf).toBeUndefined();
    });

    it('should fail to create customer with invalid email', () => {
      const { error: emailError, value: email } = Email.create('invalid-email');

      expect(emailError).toBeDefined();
      expect(email).toBeUndefined();
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
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error!.message).toBe('Customer name is required');
      expect(customer).toBeUndefined();
    });

    it('should fail to create customer with name too short', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.create({
        cpf: cpf!,
        name: 'Jo',
        email: email!,
      });

      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(ResourceInvalidException);
      expect(error!.message).toBe(
        'Customer name must be at least 3 characters long',
      );
      expect(customer).toBeUndefined();
    });

    it('should restore customer from existing data', () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');
      const createdAt = new Date('2023-01-01');
      const updatedAt = new Date('2023-01-02');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: customer } = Customer.restore({
        id: 'test-id',
        cpf: cpf!,
        name: 'João Silva',
        email: email!,
        createdAt,
        updatedAt,
      });

      expect(error).toBeUndefined();
      expect(customer).toBeDefined();
      expect(customer!.id).toBe('test-id');
      expect(customer!.name).toBe('João Silva');
      expect(customer!.cpf.toString()).toBe('11144477735');
      expect(customer!.email.toString()).toBe('test@example.com');
      expect(customer!.createdAt).toBe(createdAt);
      expect(customer!.updatedAt).toBe(updatedAt);
    });

    it('should trim whitespace from name when creating customer', () => {
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

  describe('Customer Mapper', () => {
    it('should map entity to DTO', () => {
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

      const dto = CustomerMapper.toDTO(customer!);

      expect(dto.id).toBe(customer!.id);
      expect(dto.cpf).toBe('11144477735');
      expect(dto.name).toBe('João Silva');
      expect(dto.email).toBe('test@example.com');
      expect(dto.createdAt).toBe(customer!.createdAt);
      expect(dto.updatedAt).toBe(customer!.updatedAt);
    });

    it('should map DTO to entity', () => {
      const dto: CustomerDataSourceDTO = {
        id: 'test-id',
        cpf: '11144477735',
        name: 'João Silva',
        email: 'test@example.com',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const { error, value: customer } = CustomerMapper.toEntity(dto);

      expect(error).toBeUndefined();
      expect(customer).toBeDefined();
      expect(customer!.id).toBe('test-id');
      expect(customer!.name).toBe('João Silva');
      expect(customer!.cpf.toString()).toBe('11144477735');
      expect(customer!.email.toString()).toBe('test@example.com');
      expect(customer!.createdAt).toEqual(dto.createdAt);
      expect(customer!.updatedAt).toEqual(dto.updatedAt);
    });

    it('should fail to map DTO to entity with invalid CPF', () => {
      const dto: CustomerDataSourceDTO = {
        id: 'test-id',
        cpf: 'invalid-cpf',
        name: 'João Silva',
        email: 'test@example.com',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const { error, value: customer } = CustomerMapper.toEntity(dto);

      expect(error).toBeDefined();
      expect(customer).toBeUndefined();
    });

    it('should fail to map DTO to entity with invalid email', () => {
      const dto: CustomerDataSourceDTO = {
        id: 'test-id',
        cpf: '11144477735',
        name: 'João Silva',
        email: 'invalid-email',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const { error, value: customer } = CustomerMapper.toEntity(dto);

      expect(error).toBeDefined();
      expect(customer).toBeUndefined();
    });
  });
});
