import { CustomerDataSourceDTO } from './customerDataSource.dto';
import { OrderItemDataSourceDTO } from './orderItemDataSource.dto';

export interface OrderDataSourceDto {
  id: string;
  customer?: CustomerDataSourceDTO | null;
  customer_id?: string | null;
  status: string;
  total_price: number;
  store_id: string;
  totem_id: string | null;
  created_at: Date;
  order_items: OrderItemDataSourceDTO[];
}
