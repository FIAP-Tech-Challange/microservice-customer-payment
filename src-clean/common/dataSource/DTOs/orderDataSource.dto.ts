import { OrderItemDataSourceDTO } from './orderItemDataSource.dto';

export interface OrderDataSourceDto {
  id: string;
  customer_id: string | null;
  status: string;
  total_price: number;
  store_id: string;
  totem_id: string | null;
  order_items: OrderItemDataSourceDTO[];
  created_at: string;
}
