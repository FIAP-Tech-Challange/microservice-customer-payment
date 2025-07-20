import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { CoreException } from 'src-clean/common/exceptions/coreException';

export class SaveOrderUseCase {
  constructor(private orderGateway: OrderGateway) {}

  async execute(dto: CreateOrderDto): Promise<CoreResponse<Order | undefined>> {
    const orderItemResults = dto.orderItems.map((item) =>
      OrderItem.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: 1 /* get price from product UseCase */,
      }),
    );

    const firstOrderItemError = orderItemResults.find((result) => result.error);
    if (firstOrderItemError) {
      return {
        error: firstOrderItemError.error as CoreException,
        value: undefined,
      };
    }

    const orderItems = orderItemResults.map(
      (result) => result.value as OrderItem,
    );

    const { error: createErr, value: order } = Order.create({
      orderItems: orderItems,
      storeId: dto.storeId,
      totemId: dto.totemId,
      customer: dto.customerId,
    });

    if (createErr) {
      return { error: createErr, value: undefined };
    }
    const { error: saveError, value: orderSaved } =
      await this.orderGateway.saveOrder(order);

    if (saveError) return { error: saveError, value: undefined };

    return { error: undefined, value: orderSaved };
  }
}
