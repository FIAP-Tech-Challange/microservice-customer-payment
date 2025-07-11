import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CustomerGateway } from '../gateways/customer.gateway';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';
import { Customer } from '../entities/customer.entity';
import { PaginatedResponse } from 'src-clean/core/common/DTOs/paginatedResponse.dto';

export class FindAllCustomersUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(
    dto: FindAllCustomersInputDTO,
  ): Promise<CoreResponse<PaginatedResponse<Customer>>> {
    const customersFind = await this.customerGateway.findAllCustomers(dto);

    if (customersFind.error) {
      return { error: customersFind.error, value: undefined };
    }

    return { error: undefined, value: customersFind.value };
  }
}
