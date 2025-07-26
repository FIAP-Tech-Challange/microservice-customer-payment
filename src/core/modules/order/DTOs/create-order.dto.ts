import { CreateOrderItemDto } from './create-order-item.dto';

export interface CreateOrderDto {
  storeId: string;
  customerId?: string;
  totemId?: string;
  orderItems: CreateOrderItemDto[];
}
