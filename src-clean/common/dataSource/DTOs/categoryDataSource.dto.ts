import { ProductDataSourceDTO } from './productDataSource.dto';

export interface CategoryDataSourceDTO {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  store_id: string;
  products: ProductDataSourceDTO[];
}
