import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { UpdateCustomerInputDTO } from '../DTOs/updateCustomerInput.dto';

export class UpdateCustomerUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(dto: UpdateCustomerInputDTO): Promise<CoreResponse<Customer>> {
    const { error: findError, value: existingCustomer } = 
      await this.customerGateway.findCustomerById(dto.id);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!existingCustomer) {
      return {
        error: new ResourceNotFoundException(`Customer with ID ${dto.id} not found`),
        value: undefined,
      };
    }

    const { error: updateError, value: updatedCustomer } = 
      existingCustomer.update({
        name: dto.name,
        email: dto.email,
      });

    if (updateError) {
      return { error: updateError, value: undefined };
    }


    const { error: saveError, value: savedCustomer } = 
      await this.customerGateway.updateCustomer(updatedCustomer!);

    if (saveError) {
      return { error: saveError, value: undefined };
    }

    return { error: undefined, value: savedCustomer };
  }
}
