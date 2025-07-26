import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { CreateCustomerInputDTO } from '../DTOs/createCustomerInput.dto';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CustomerDTO } from '../DTOs/customer.dto';
import { CustomerGateway } from '../gateways/customer.gateway';
import { CreateCustomerUseCase } from '../useCases/createCustomer.useCase';
import { CustomerPresenter } from '../presenters/customer.presenter';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';
import { FindCustomerByIdUseCase } from '../useCases/findCustomerById.useCase';
import { FindCustomerByEmailUseCase } from '../useCases/findCustomerByEmail.useCase';
import { FindCustomerByCpfUseCase } from '../useCases/findCustomerByCpf.useCase';
import { FindAllCustomersInputDTO } from '../DTOs/findCustomerInput.dto';
import { FindAllCustomersUseCase } from '../useCases/findAllCustomers.useCase';
import { PaginatedResponse } from 'src/core/common/DTOs/paginatedResponse.dto';
import { SendNotificationUseCase } from '../../notification/useCases/sendNotification.useCase';
import { NotificationGateway } from '../../notification/gateways/notification.gateway';

export class CustomerCoreController {
  constructor(private dataSource: DataSource) {}

  async createCustomer(
    dto: CreateCustomerInputDTO,
  ): Promise<CoreResponse<CustomerDTO>> {
    try {
      const gateway = new CustomerGateway(this.dataSource);
      const notificationGateway = new NotificationGateway(this.dataSource);

      const sendNotificationUseCase = new SendNotificationUseCase(
        notificationGateway,
      );
      const useCase = new CreateCustomerUseCase(
        gateway,
        sendNotificationUseCase,
      );

      const { error: err, value: customer } = await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: CustomerPresenter.toDTO(customer) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while creating customer',
        ),
        value: undefined,
      };
    }
  }

  async findCustomerById(id: string): Promise<CoreResponse<CustomerDTO>> {
    try {
      const gateway = new CustomerGateway(this.dataSource);
      const useCase = new FindCustomerByIdUseCase(gateway);

      const { error: err, value: customer } = await useCase.execute(id);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: CustomerPresenter.toDTO(customer) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding customer by id',
        ),
        value: undefined,
      };
    }
  }

  async findCustomerByEmail(email: string): Promise<CoreResponse<CustomerDTO>> {
    try {
      const gateway = new CustomerGateway(this.dataSource);
      const useCase = new FindCustomerByEmailUseCase(gateway);

      const { error: err, value: customer } = await useCase.execute(email);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: CustomerPresenter.toDTO(customer) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding customer by email',
        ),
        value: undefined,
      };
    }
  }

  async findCustomerByCPF(cpf: string): Promise<CoreResponse<CustomerDTO>> {
    try {
      const gateway = new CustomerGateway(this.dataSource);
      const useCase = new FindCustomerByCpfUseCase(gateway);

      const { error: err, value: customer } = await useCase.execute(cpf);

      if (err) return { error: err, value: undefined };

      return { error: undefined, value: CustomerPresenter.toDTO(customer) };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding customer by cpf',
        ),
        value: undefined,
      };
    }
  }

  async findAllCustomersPaginated(
    dto: FindAllCustomersInputDTO,
  ): Promise<CoreResponse<PaginatedResponse<CustomerDTO>>> {
    try {
      const gateway = new CustomerGateway(this.dataSource);
      const useCase = new FindAllCustomersUseCase(gateway);

      const { error: err, value: paginatedResponse } =
        await useCase.execute(dto);

      if (err) return { error: err, value: undefined };

      return {
        error: undefined,
        value: CustomerPresenter.toPaginatedDTO(paginatedResponse),
      };
    } catch (error) {
      console.error(error);
      return {
        error: new UnexpectedError(
          'Something went wrong while finding customer by cpf',
        ),
        value: undefined,
      };
    }
  }
}
