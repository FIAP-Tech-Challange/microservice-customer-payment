import { Order } from '../entities/order.entity';

export interface OrderSortedListDto {
  total: number;
  data: Order[];
}
