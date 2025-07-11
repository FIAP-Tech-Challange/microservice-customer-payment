import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { FindCustomerByIdInputDTO } from '../DTOs/findCustomerInput.dto';

export class FindCustomerByIdUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(dto: FindCustomerByIdInputDTO): Promise<CoreResponse<Customer>> {
    const { error: findError, value: customer } = 
      await this.customerGateway.findCustomerById(dto.id);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!customer) {
      return {
        error: new ResourceNotFoundException(`Customer with ID ${dto.id} not found`),
        value: undefined,
      };
    }

    return { error: undefined, value: customer };
  }
}
