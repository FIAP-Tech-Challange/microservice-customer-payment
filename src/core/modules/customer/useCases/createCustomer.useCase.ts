import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { Customer } from '../entities/customer.entity';
import { CustomerGateway } from '../gateways/customer.gateway';
import { CreateCustomerInputDTO } from '../DTOs/createCustomerInput.dto';
import { CPF } from 'src/core/common/valueObjects/cpf.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationChannel } from '../../notification/entities/notification.enums';

export class CreateCustomerUseCase {
  constructor(
    private customerGateway: CustomerGateway,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  async execute(dto: CreateCustomerInputDTO): Promise<CoreResponse<Customer>> {
    const cpf = CPF.create(dto.cpf);
    if (cpf.error) return { error: cpf.error, value: undefined };

    const email = Email.create(dto.email);
    if (email.error) return { error: email.error, value: undefined };

    const customerCreate = Customer.create({
      name: dto.name,
      cpf: cpf.value,
      email: email.value,
    });

    if (customerCreate.error) {
      return { error: customerCreate.error, value: undefined };
    }

    const findCPF = await this.customerGateway.findCustomerByCpf(cpf.value);
    if (findCPF.error) return { error: findCPF.error, value: undefined };
    if (findCPF.value) {
      return {
        error: new ResourceConflictException(
          'Customer with this CPF already exists',
        ),
        value: undefined,
      };
    }

    const findEmail = await this.customerGateway.findCustomerByEmail(
      email.value,
    );
    if (findEmail.error) return { error: findEmail.error, value: undefined };
    if (findEmail.value) {
      return {
        error: new ResourceConflictException(
          'Customer with this email already exists',
        ),
        value: undefined,
      };
    }

    const saveCustomer = await this.customerGateway.saveCustomer(
      customerCreate.value,
    );

    if (saveCustomer.error) {
      return { error: saveCustomer.error, value: undefined };
    }

    const sendNotification = await this.sendNotificationUseCase.execute({
      channel: NotificationChannel.EMAIL,
      destinationToken: email.value.toString(),
      message: `Welcome ${customerCreate.value.name}, your registration was successful!`,
    });

    if (sendNotification.error) {
      console.error('Failed to send notification:', sendNotification.error);
      return { error: sendNotification.error, value: undefined };
    }

    return { error: undefined, value: customerCreate.value };
  }
}
