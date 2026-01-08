import { FindAllCustomersUseCase } from 'src/core/modules/customer/useCases/findAllCustomers.useCase';
import { CustomerGateway } from 'src/core/modules/customer/gateways/customer.gateway';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Customer } from 'src/core/modules/customer/entities/customer.entity';

describe('FindAllCustomersUseCase', () => {
  let mockCustomerGateway: Partial<CustomerGateway>;
  let useCase: FindAllCustomersUseCase;

  beforeEach(() => {
    mockCustomerGateway = {
      findAllCustomers: jest.fn(),
    };

    useCase = new FindAllCustomersUseCase(
      mockCustomerGateway as CustomerGateway,
    );
  });

  it('should find all customers', async () => {
    const { value: cpf } = CPF.create('11144477735');
    const { value: email } = Email.create('test@example.com');
    const { value: mockCustomer } = Customer.create({
      cpf: cpf!,
      name: 'João Silva',
      email: email!,
    });

    (mockCustomerGateway.findAllCustomers as jest.Mock).mockResolvedValue({
      error: undefined,
      value: {
        count: 1,
        data: [mockCustomer],
      },
    });

    const result = await useCase.execute({ page: 1, size: 10 });

    expect(result.error).toBeUndefined();
    expect(result.value?.data).toBeDefined();
    expect(result.value?.data?.length).toBe(1);
  });
});
