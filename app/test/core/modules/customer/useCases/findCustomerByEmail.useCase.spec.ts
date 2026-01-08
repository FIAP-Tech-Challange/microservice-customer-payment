import { FindCustomerByEmailUseCase } from 'src/core/modules/customer/useCases/findCustomerByEmail.useCase';
import { CustomerGateway } from 'src/core/modules/customer/gateways/customer.gateway';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Customer } from 'src/core/modules/customer/entities/customer.entity';

describe('FindCustomerByEmailUseCase', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let useCase: FindCustomerByEmailUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findCustomerByEmail: jest.fn(),
    };

    useCase = new FindCustomerByEmailUseCase(
      mockCustomerGateway as CustomerGateway,
    );
  });

  it('should find customer by email', async () => {
    const { value: cpf } = CPF.create('11144477735');
    const { value: email } = Email.create('test@example.com');
    const { value: mockCustomer } = Customer.create({
      cpf: cpf!,
      name: 'João Silva',
      email: email!,
    });

    (mockCustomerGateway.findCustomerByEmail as jest.Mock).mockResolvedValue({
      error: undefined,
      value: mockCustomer,
    });

    const result = await useCase.execute('test@example.com');

    expect(result.error).toBeUndefined();
    expect(result.value).toBeDefined();
    expect(result.value?.name).toBe('João Silva');
  });

  it('should return error when customer not found', async () => {
    (mockCustomerGateway.findCustomerByEmail as jest.Mock).mockResolvedValue({
      error: undefined,
      value: null,
    });

    const result = await useCase.execute('notfound@example.com');

    expect(result.error).toBeDefined();
    expect(result.value).toBeUndefined();
  });
});
