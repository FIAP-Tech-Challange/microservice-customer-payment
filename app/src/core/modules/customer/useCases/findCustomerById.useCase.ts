import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';

export class FindCustomerByIdUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(id: string): Promise<CoreResponse<Customer>> {
    const { error: findError, value: customer } =
      await this.customerGateway.findCustomerById(id);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!customer) {
      return {
        error: new ResourceNotFoundException(
          `Customer with ID ${id} not found`,
        ),
        value: undefined,
      };
    }

    return { error: undefined, value: customer };
  }
}
