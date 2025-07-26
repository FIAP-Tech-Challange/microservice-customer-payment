import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { FindCustomerByIdUseCase } from '../../customer/useCases/findCustomerById.useCase';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { Order } from '../entities/order.entity';

export class LinkCustomerToOrderUseCase {
  constructor(
    private orderGateway: OrderGateway,
    private findCustomerByIdUseCase: FindCustomerByIdUseCase,
  ) {}

  async execute(
    orderId: string,
    customerId: string,
    storeId: string,
  ): Promise<CoreResponse<Order>> {
    const { error: customerError, value: customer } =
      await this.findCustomerByIdUseCase.execute(customerId);
    if (customerError) return { error: customerError, value: undefined };

    const { error: findError, value: order } =
      await this.orderGateway.findOrderById(orderId);

    if (findError) return { error: findError, value: undefined };

    if (!order) {
      return {
        error: new ResourceNotFoundException('Order not found'),
        value: undefined,
      };
    }

    if (order.storeId !== storeId) {
      return {
        error: new ResourceInvalidException(
          `Order with id ${orderId} does not belong to store ${storeId}`,
        ),
        value: undefined,
      };
    }

    try {
      const { error: errorAssociate } = order.associateCustomer(customer);

      if (errorAssociate) {
        return {
          error: new ResourceInvalidException(`${errorAssociate.message}`),
          value: undefined,
        };
      }
    } catch (error) {
      return {
        error: new ResourceInvalidException(
          `Failed to associate customer: ${error.message}`,
        ),
        value: undefined,
      };
    }

    const { error: linkError } = await this.orderGateway.saveOrder(order);
    if (linkError) return { error: linkError, value: undefined };

    return { error: undefined, value: order };
  }
}
