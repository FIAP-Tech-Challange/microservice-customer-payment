import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { CustomerGateway } from '../gateways/customer.gateway';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';
import { Customer } from '../entities/customer.entity';

export class FindAllCustomersUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(
    dto: FindAllCustomersInputDTO,
  ): Promise<CoreResponse<Customer[]>> {
    const { error: findError, value: customers } =
      await this.customerGateway.findAllCustomers(dto);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!customers || customers.length === 0) {
      return {
        error: new ResourceNotFoundException('No customers found'),
        value: undefined,
      };
    }

    return { error: undefined, value: customers };
  }
}
