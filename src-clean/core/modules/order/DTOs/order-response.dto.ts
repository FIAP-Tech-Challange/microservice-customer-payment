import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: string;
  customerId?: string | undefined;
  status: string;
  totalPrice: number;
  storeId: string;
  totemId?: string;
  createdAt: Date;
  orderItems: OrderItemResponseDto[];
}
