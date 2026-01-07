import { FindCustomerByCpfUseCase } from 'src/core/modules/customer/useCases/findCustomerByCpf.useCase';
import { CustomerGateway } from 'src/core/modules/customer/gateways/customer.gateway';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Customer } from 'src/core/modules/customer/entities/customer.entity';

describe('FindCustomerByCpfUseCase', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let useCase: FindCustomerByCpfUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerByCpf: jest.fn(),
    };

    useCase = new FindCustomerByCpfUseCase(
      mockCustomerGateway as CustomerGateway,
    );
  });

  it('should find customer by CPF', async () => {
    const { value: cpf } = CPF.create('11144477735');
    const { value: email } = Email.create('test@example.com');
    const { value: mockCustomer } = Customer.create({
      cpf: cpf!,
      name: 'João Silva',
      email: email!,
    });

    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCustomer,
    });

    const result = await useCase.execute('11144477735');

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.name).toBe('João Silva');
  });

  it('should return error when customer not found', async () => {
    (mockCustomerGateway.findCustomerByCpf as jest.Mock).mockResolvedValue({
      error: undefined,
      value: null,
    });

    const result = await useCase.execute('11144477735');

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
  });
});
