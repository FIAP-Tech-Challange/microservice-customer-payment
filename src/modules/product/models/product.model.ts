// import { Category } from '../../category/models/category.model';
// import { Store } from '../../store/models/store.model';

export class ProductModel {
  id: number;
  name: string;
  price: string;
  created_at: Date;
  status: string;
  description: string;
  prep_time: number;
  image_url: string;
  // category_id: Category;
  // store_id: Store;
}