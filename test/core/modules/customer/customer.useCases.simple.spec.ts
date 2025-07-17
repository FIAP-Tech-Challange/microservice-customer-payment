import { CreateCustomerUseCase } from 'src-clean/core/modules/customer/useCases/createCustomer.useCase';
import { FindCustomerByIdUseCase } from 'src-clean/core/modules/customer/useCases/findCustomerById.useCase';
import { CustomerGateway } from 'src-clean/core/modules/customer/gateways/customer.gateway';
import { Customer } from 'src-clean/core/modules/customer/entities/customer.entity';
import { CPF } from 'src-clean/core/common/valueObjects/cpf.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

describe('Customer Use Cases Tests', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let createCustomerUseCase: CreateCustomerUseCase;
  let findCustomerByIdUseCase: FindCustomerByIdUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerById: jest.fn(),
      findCustomerByCpf: jest.fn(),
      findCustomerByEmail: jest.fn(),
      saveCustomer: jest.fn(),
    };

    createCustomerUseCase = new CreateCustomerUseCase(
      mockCustomerGateway as CustomerGateway,
    );
    findCustomerByIdUseCase = new FindCustomerByIdUseCase(
      mockCustomerGateway as CustomerGateway,
    );
  });

  describe('CreateCustomerUseCase', () => {
    it('should create a customer successfully', async () => {
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

      (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
        error: undefined,
        value: null,
      });
      (mockCustomerGateway.findCustomerByEmail as jest.Mock).mockResolvedValue({
        error: undefined,
        value: null,
      });
      (mockCustomerGateway.saveCustomer as jest.Mock).mockResolvedValue({
        error: undefined,
        value: customer!,
      });

      const result = await createCustomerUseCase.execute({
        cpf: '11144477735',
        name: 'João Silva',
        email: 'test@example.com',
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.name).toBe('João Silva');
      expect(result.value!.cpf.toString()).toBe('11144477735');
      expect(result.value!.email.toString()).toBe('test@example.com');
    });

    it('should fail to create customer with existing CPF', async () => {
      const { error: cpfError, value: cpf } = CPF.create('11144477735');
      const { error: emailError, value: email } =
        Email.create('test@example.com');

      expect(cpfError).toBeUndefined();
      expect(emailError).toBeUndefined();

      const { error, value: existingCustomer } = Customer.create({
        cpf: cpf!,
        name: 'Existing Customer',
        email: email!,
      });

      expect(error).toBeUndefined();
      expect(existingCustomer).toBeDefined();

      (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
        error: undefined,
        value: existingCustomer!,
      });

      const result = await createCustomerUseCase.execute({
        cpf: '11144477735',
        name: 'João Silva',
        email: 'test@example.com',
      });

      expect(result.error).toBeDefined();
      expect(result.value).toBeUndefined();
      expect(result.error!.message).toContain('CPF already exists');
    });
  });

  describe('FindCustomerByIdUseCase', () => {
    it('should find a customer by ID successfully', async () => {
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

      (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
        error: undefined,
        value: customer!,
      });

      const result = await findCustomerByIdUseCase.execute(customer!.id);

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.id).toBe(customer!.id);
      expect(result.value!.name).toBe('João Silva');
    });

    it('should return error when customer not found', async () => {
      (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
        error: undefined,
        value: null,
      });

      const result = await findCustomerByIdUseCase.execute('non-existent-id');

      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.value).toBeUndefined();
    });
  });
});
