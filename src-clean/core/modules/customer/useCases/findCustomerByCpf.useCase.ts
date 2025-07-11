import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { FindCustomerByCpfInputDTO } from '../DTOs/findCustomerInput.dto';

export class FindCustomerByCpfUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(dto: FindCustomerByCpfInputDTO): Promise<CoreResponse<Customer>> {
    const { error: findError, value: customer } = 
      await this.customerGateway.findCustomerByCpf(dto.cpf);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!customer) {
      return {
        error: new ResourceNotFoundException(`Customer with CPF ${dto.cpf} not found`),
        value: undefined,
      };
    }

    return { error: undefined, value: customer };
  }
}
