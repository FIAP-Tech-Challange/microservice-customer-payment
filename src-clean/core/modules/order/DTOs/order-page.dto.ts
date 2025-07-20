import { Order } from '../entities/order.entity';

export interface OrderPageDto {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
