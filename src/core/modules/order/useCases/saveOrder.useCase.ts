import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { OrderGateway } from '../gateways/order.gateway';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../DTOs/create-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { CoreException } from 'src/common/exceptions/coreException';
import { FindProductsByIdUseCase } from '../../product/useCases/findProductsById.useCase';

export class SaveOrderUseCase {
  constructor(
    private orderGateway: OrderGateway,
    private findProductsByIdUseCase: FindProductsByIdUseCase,
  ) {}

  async execute(dto: CreateOrderDto): Promise<CoreResponse<Order | undefined>> {
    const productIds = new Set<string>();
    dto.orderItems.forEach((item) => productIds.add(item.productId));

    const findProducts = await this.findProductsByIdUseCase.execute(
      Array.from(productIds),
      dto.storeId,
    );
    if (findProducts.error) {
      return { error: findProducts.error, value: undefined };
    }

    const orderItemResults = dto.orderItems.map((item) =>
      OrderItem.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice:
          findProducts.value.find((p) => p.id === item.productId)?.price || 0,
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
      customerId: dto.customerId,
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
