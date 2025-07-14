import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: string;
  customer?: string | undefined;
  status: string;
  totalPrice: number;
  storeId: string;
  totemId?: string;
  orderItems: OrderItemResponseDto[];
  createdAt: Date;
}
