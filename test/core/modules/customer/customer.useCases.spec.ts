import { CreateCustomerUseCase } from 'src-clean/core/modules/customer/useCases/createCustomer.useCase';
import { FindCustomerByIdUseCase } from 'src-clean/core/modules/customer/useCases/findCustomerById.useCase';
import { FindAllCustomersUseCase } from 'src-clean/core/modules/customer/useCases/findAllCustomers.useCase';
import { CustomerGateway } from 'src-clean/core/modules/customer/gateways/customer.gateway';
import { Customer } from 'src-clean/core/modules/customer/entities/customer.entity';
import { CPF } from 'src-clean/core/common/valueObjects/cpf.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

describe('Customer Use Cases Tests', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let createCustomerUseCase: CreateCustomerUseCase;
  let findCustomerByIdUseCase: FindCustomerByIdUseCase;
  let findAllCustomersUseCase: FindAllCustomersUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerById: jest.fn(),
      findCustomerByCpf: jest.fn(),
      findCustomerByEmail: jest.fn(),
      findAllCustomers: jest.fn(),
      saveCustomer: jest.fn(),
      deleteCustomer: jest.fn(),
    };

    createCustomerUseCase = new CreateCustomerUseCase(
      mockCustomerGateway as CustomerGateway,
    );
    findCustomerByIdUseCase = new FindCustomerByIdUseCase(
      mockCustomerGateway as CustomerGateway,
    );
    findAllCustomersUseCase = new FindAllCustomersUseCase(
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

  describe('FindAllCustomersUseCase', () => {
    it('should find all customers successfully', async () => {
      const { error: cpfError1, value: cpf1 } = CPF.create('11144477735');
      const { error: emailError1, value: email1 } =
        Email.create('test1@example.com');
      const { error: cpfError2, value: cpf2 } = CPF.create('12345678909');
      const { error: emailError2, value: email2 } =
        Email.create('test2@example.com');

      expect(cpfError1).toBeUndefined();
      expect(emailError1).toBeUndefined();
      expect(cpfError2).toBeUndefined();
      expect(emailError2).toBeUndefined();

      const { error: error1, value: customer1 } = Customer.create({
        cpf: cpf1!,
        name: 'João Silva',
        email: email1!,
      });

      const { error: error2, value: customer2 } = Customer.create({
        cpf: cpf2!,
        name: 'Maria Santos',
        email: email2!,
      });

      expect(error1).toBeUndefined();
      expect(error2).toBeUndefined();
      expect(customer1).toBeDefined();
      expect(customer2).toBeDefined();

      (mockCustomerGateway.findAllCustomers as jest.Mock).mockResolvedValue({
        error: undefined,
        value: {
          data: [customer1!, customer2!],
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });

      const result = await findAllCustomersUseCase.execute({
        page: 1,
        size: 10,
      });

      expect(result.error).toBeUndefined();
      expect(result.value).toBeDefined();
      expect(result.value!.data.length).toBe(2);
      expect(result.value!.data[0].name).toBe('João Silva');
      expect(result.value!.data[1].name).toBe('Maria Santos');
    });

    it('should return error when no customers found', async () => {
      (mockCustomerGateway.findAllCustomers as jest.Mock).mockResolvedValue({
        error: undefined,
        value: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      });

      const result = await findAllCustomersUseCase.execute({
        page: 1,
        size: 10,
      });

      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(ResourceNotFoundException);
      expect(result.value).toBeUndefined();
    });
  });
});
