export interface ProductDataSourceDTO {
  id: string;
  name: string;
  price: number;
  description: string;
  prep_time: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  store_id: string;
}
