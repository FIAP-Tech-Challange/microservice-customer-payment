import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { Email } from 'src/core/common/valueObjects/email.vo';

export class FindCustomerByEmailUseCase {
  constructor(private customerGateway: CustomerGateway) {}

  async execute(email: string): Promise<CoreResponse<Customer>> {
    const emailObject = Email.create(email);
    if (emailObject.error) {
      return {
        error: emailObject.error,
        value: undefined,
      };
    }

    const customer = await this.customerGateway.findCustomerByEmail(
      emailObject.value,
    );

    if (customer.error) return { error: customer.error, value: undefined };

    if (!customer.value) {
      return {
        error: new ResourceNotFoundException(
          `Customer with Email ${email} not found`,
        ),
        value: undefined,
      };
    }

    return { error: undefined, value: customer.value };
  }
}
