export interface OrderItemDataSourceDTO {
  id: string;
  order_id: string;
  product_id: string;
  unit_price: number;
  subtotal: number;
  quantity: number;
  created_at: Date;
}
