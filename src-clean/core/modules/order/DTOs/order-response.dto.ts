import { CustomerResponseDTO } from '../../customer/DTOs/customerResponse.dto';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  id: string;
  customer?: CustomerResponseDTO | undefined;
  status: string;
  totalPrice: number;
  storeId: string;
  totemId?: string;
  createdAt: Date;
  orderItems: OrderItemResponseDto[];
}
