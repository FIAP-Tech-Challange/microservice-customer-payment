import { ProductDataSourceDTO } from './productDataSource.dto';

export interface CategoryDataSourceDTO {
  store_id: string;
  updated_at: any;
  id: string;
  email: string;
  name: string;
  created_at: string;
  products: ProductDataSourceDTO[];
}
