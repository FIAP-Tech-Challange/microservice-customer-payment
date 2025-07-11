import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceConflictException } from 'src-clean/common/exceptions/resourceConflictException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { CreateCustomerInputDTO } from '../DTOs/createCustomerInput.dto';

export class CreateCustomerUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(dto: CreateCustomerInputDTO): Promise<CoreResponse<Customer>> {
    const { error: createError, value: customer } = Customer.create({
      cpf: dto.cpf,
      name: dto.name,
      email: dto.email,
    });

    if (createError) {
      return { error: createError, value: undefined };
    }

    const { error: findError, value: existingCustomer } =
      await this.customerGateway.findCustomerByCpf(dto.cpf);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (existingCustomer) {
      return {
        error: new ResourceConflictException(
          'Customer with this CPF already exists',
        ),
        value: undefined,
      };
    }

    const { error: saveError, value: savedCustomer } =
      await this.customerGateway.saveCustomer(customer);

    if (saveError) {
      return { error: saveError, value: undefined };
    }

    return { error: undefined, value: savedCustomer };
  }
}
