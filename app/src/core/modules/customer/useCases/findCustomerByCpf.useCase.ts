import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';

export class FindCustomerByCpfUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(cpf: string): Promise<CoreResponse<Customer>> {
    const cpfObject = CPF.create(cpf);
    if (cpfObject.error) return { error: cpfObject.error, value: undefined };

    const { error: findError, value: customer } =
      await this.customerGateway.findCustomerByCpf(cpfObject.value);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!customer) {
      return {
        error: new ResourceNotFoundException(
          `Customer with CPF ${cpf} not found`,
        ),
        value: undefined,
      };
    }

    return { error: undefined, value: customer };
  }
}
