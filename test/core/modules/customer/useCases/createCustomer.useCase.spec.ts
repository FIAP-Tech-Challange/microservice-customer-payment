import { CreateCustomerUseCase } from 'src/core/modules/customer/useCases/createCustomer.useCase';
import { CustomerGateway } from 'src/core/modules/customer/gateways/customer.gateway';
import { Customer } from 'src/core/modules/customer/entities/customer.entity';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { CreateCustomerInputDTO } from 'src/core/modules/customer/DTOs/createCustomerInput.dto';
import { SendNotificationUseCase } from 'src/core/modules/notification/useCases/sendNotification.useCase';

describe('CreateCustomerUseCase', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let mockSendNotificationUseCase: Partial<SendNotificationUseCase>;
  let createCustomerUseCase: CreateCustomerUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerByCpf: jest.fn(),
      findCustomerByEmail: jest.fn(),
      saveCustomer: jest.fn(),
    };

    mockSendNotificationUseCase = {
      execute: jest.fn().mockResolvedValue({ error: undefined, value: {} }),
    };

    createCustomerUseCase = new CreateCustomerUseCase(
      mockCustomerGateway as CustomerGateway,
      mockSendNotificationUseCase as SendNotificationUseCase,
    );
  });

  it('should create a customer successfully', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: '11144477735',
      email: 'test@example.com',
    };

    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });
    (mockCustomerGateway.findCustomerByEmail as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    (mockCustomerGateway.saveCustomer as jest.Mock).mockImplementation(
      (customer: Customer) => ({
        error: undefined,
        value: customer,
      }),
    );

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(mockCustomerGateway.findCustomerByCpf).toHaveBeenCalled();
    expect(mockCustomerGateway.findCustomerByEmail).toHaveBeenCalled();
    expect(mockCustomerGateway.saveCustomer).toHaveBeenCalled();
  });

  it('should fail when CPF is invalid', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: 'invalid-cpf',
      email: 'test@example.com',
    };

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerByCpf).not.toHaveBeenCalled();
  });

  it('should fail when email is invalid', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: '11144477735',
      email: 'invalid-email',
    };

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerByCpf).not.toHaveBeenCalled();
  });

  it('should fail when customer with same CPF already exists', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: '11144477735',
      email: 'test@example.com',
    };

    const { value: cpf } = CPF.create('11144477735');
    const { value: email } = Email.create('existing@example.com');
    const { value: existingCustomer } = Customer.create({
      cpf: cpf!,
      name: 'Existing Customer',
      email: email!,
    });

    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: existingCustomer,
    });

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error?.message).toContain('CPF already exists');
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerByCpf).toHaveBeenCalled();
    expect(mockCustomerGateway.findCustomerByEmail).not.toHaveBeenCalled();
  });

  it('should fail when customer with same email already exists', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: '11144477735',
      email: 'test@example.com',
    };

    const { value: cpf } = CPF.create('22255588846');
    const { value: email } = Email.create('test@example.com');
    const { value: existingCustomer } = Customer.create({
      cpf: cpf!,
      name: 'Existing Customer',
      email: email!,
    });

    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    (mockCustomerGateway.findCustomerByEmail as jest.Mock).mockResolvedValue({
      error: undefined,
      value: existingCustomer,
    });

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceConflictException);
    expect(result.error?.message).toContain('email already exists');
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerByCpf).toHaveBeenCalled();
    expect(mockCustomerGateway.findCustomerByEmail).toHaveBeenCalled();
    expect(mockCustomerGateway.saveCustomer).not.toHaveBeenCalled();
  });

  it('should handle gateway errors when finding by CPF', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: '11144477735',
      email: 'test@example.com',
    };

    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: new Error('Database error'),
      value: undefined,
    });

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Database error');
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerByCpf).toHaveBeenCalled();
    expect(mockCustomerGateway.findCustomerByEmail).not.toHaveBeenCalled();
  });

  it('should handle gateway errors when saving customer', async () => {
    const inputDto: CreateCustomerInputDTO = {
      name: 'João Silva',
      cpf: '11144477735',
      email: 'test@example.com',
    };

    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });
    (mockCustomerGateway.findCustomerByEmail as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    (mockCustomerGateway.saveCustomer as jest.Mock).mockResolvedValue({
      error: new Error('Save error'),
      value: undefined,
    });

    const result = await createCustomerUseCase.execute(inputDto);

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Save error');
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.saveCustomer).toHaveBeenCalled();
  });
});
