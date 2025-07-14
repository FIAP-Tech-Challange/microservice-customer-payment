export interface PaymentExternalDataSourceDTO {
  id: string;
  order_id: string;
  store_id: string;
  payment_type: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
}
