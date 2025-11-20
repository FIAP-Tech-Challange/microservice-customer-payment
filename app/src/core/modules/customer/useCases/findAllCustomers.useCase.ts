import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { CustomerGateway } from '../gateways/customer.gateway';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';
import { PaginatedResponse } from 'src/core/common/DTOs/paginatedResponse.dto';
import { Customer } from '../entities/customer.entity';

export class FindAllCustomersUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(
    dto: FindAllCustomersInputDTO,
  ): Promise<CoreResponse<PaginatedResponse<Customer>>> {
    const { error: findError, value: paginatedResponse } =
      await this.customerGateway.findAllCustomers(dto);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!paginatedResponse || paginatedResponse.data.length === 0) {
      return {
        error: new ResourceNotFoundException('No customers found'),
        value: undefined,
      };
    }

    return { error: undefined, value: paginatedResponse };
  }
}
