import { FindCustomerByIdUseCase } from 'src/core/modules/customer/useCases/findCustomerById.useCase';
import { CustomerGateway } from 'src/core/modules/customer/gateways/customer.gateway';
import { Customer } from 'src/core/modules/customer/entities/customer.entity';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

describe('FindCustomerByIdUseCase', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let findCustomerByIdUseCase: FindCustomerByIdUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerById: jest.fn(),
    };

    findCustomerByIdUseCase = new FindCustomerByIdUseCase(
      mockCustomerGateway as CustomerGateway,
    );
  });

  it('should find customer by id successfully', async () => {
    const customerId = 'test-customer-id';

    const { value: cpf } = CPF.create('11144477735');
    const { value: email } = Email.create('test@example.com');
    const { value: mockCustomer } = Customer.create({
      cpf: cpf!,
      name: 'João Silva',
      email: email!,
    });

    (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCustomer,
    });

    const result = await findCustomerByIdUseCase.execute(customerId);

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.name).toBe('João Silva');
    expect(mockCustomerGateway.findCustomerById).toHaveBeenCalledWith(
      customerId,
    );
  });

  it('should return error when customer is not found', async () => {
    const customerId = 'non-existent-id';

    (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await findCustomerByIdUseCase.execute(customerId);

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.message).toContain(
      'Customer with ID non-existent-id not found',
    );
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerById).toHaveBeenCalledWith(
      customerId,
    );
  });

  it('should handle gateway errors', async () => {
    const customerId = 'test-customer-id';
    const gatewayError = new Error('Database connection error');

    (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
      error: gatewayError,
      value: undefined,
    });

    const result = await findCustomerByIdUseCase.execute(customerId);

    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('Database connection error');
    expect(result.value).toBeUndefined();
    expect(mockCustomerGateway.findCustomerById).toHaveBeenCalledWith(
      customerId,
    );
  });

  it('should handle empty customer id', async () => {
    (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await findCustomerByIdUseCase.execute('');

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.value).toBeUndefined();
  });

  it('should handle null customer id', async () => {
    (mockCustomerGateway.findCustomerById as jest.Mock).mockResolvedValue({
      error: undefined,
      value: undefined,
    });

    const result = await findCustomerByIdUseCase.execute('');

    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.value).toBeUndefined();
  });
});
