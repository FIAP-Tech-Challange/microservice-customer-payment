export interface PaymentDataSourceDTO {
  id: string;
  order_id: string;
  store_id: string;
  payment_type: string;
  status: string;
  total: number;
  external_id: string;
  qr_code: string | null;
  platform: string;
  created_at: string;
}
