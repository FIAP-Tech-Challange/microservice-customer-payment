import { CreateCustomerUseCase } from 'src/core/modules/customer/useCases/createCustomer.useCase';
import { CustomerGateway } from 'src/core/modules/customer/gateways/customer.gateway';

describe('CreateCustomerUseCase', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let useCase: CreateCustomerUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerByCpf: jest.fn(),
      findCustomerByEmail: jest.fn(),
      saveCustomer: jest.fn(),
    };

    useCase = new CreateCustomerUseCase(mockCustomerGateway as CustomerGateway);
  });

  it('should create customer successfully', async () => {
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
      value: undefined,
    });

    const result = await useCase.execute({
      name: 'John Doe',
      cpf: '11144477735',
      email: 'john@example.com',
    });

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.name).toBe('John Doe');
    expect(mockCustomerGateway.saveCustomer).toHaveBeenCalled();
  });

  it('should return error when CPF already exists', async () => {
    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: {
        id: '123',
        name: 'Existing',
        cpf: '11144477735',
        email: 'existing@test.com',
      },
    });

    const result = await useCase.execute({
      name: 'John Doe',
      cpf: '11144477735',
      email: 'john@example.com',
    });

    expect(result.error).toBeDefined();
    expect(mockCustomerGateway.saveCustomer).not.toHaveBeenCalled();
  });

  it('should return error with invalid CPF', async () => {
    const result = await useCase.execute({
      name: 'John Doe',
      cpf: 'invalid',
      email: 'john@example.com',
    });

    expect(result.error).toBeDefined();
    expect(mockCustomerGateway.saveCustomer).not.toHaveBeenCalled();
  });

  it('should return error with invalid email', async () => {
    const result = await useCase.execute({
      name: 'John Doe',
      cpf: '11144477735',
      email: 'invalid-email',
    });

    expect(result.error).toBeDefined();
    expect(mockCustomerGateway.saveCustomer).not.toHaveBeenCalled();
  });
});
