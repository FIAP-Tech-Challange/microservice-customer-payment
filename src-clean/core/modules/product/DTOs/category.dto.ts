import { ProductDTO } from './product.dto';

export interface CategoryDTO {
  id: string;
  name: string;
  products: ProductDTO[];
}
