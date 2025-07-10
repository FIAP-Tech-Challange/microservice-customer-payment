import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';
import { ProductDataSourceDTO } from './DTOs/productDataSource.dto';
import { CategoryDataSourceDTO } from './DTOs/categoryDataSource.dto';
import { TotemDataSourceDTO } from './DTOs/totemDataSource.dto';

export interface DataSource {
  findTotemByAccessToken(
    accessToken: string,
  ): Promise<TotemDataSourceDTO | null>;
  saveCategory(categoryDTO: void): unknown;
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null>;
  findCategoryByName(name: string): Promise<CategoryDataSourceDTO | null>;
  
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null>;
  findStoreByName(name: string): Promise<StoreDataSourceDTO | null>;
  findStoreById(id: string): Promise<StoreDataSourceDTO | null>;
  saveStore(store: StoreDataSourceDTO): Promise<void>;
  findProductById(id: string): Promise<ProductDataSourceDTO | null>;
  saveProduct(product: ProductDataSourceDTO): Promise<void>;
  findProductByName(name: string): ProductDataSourceDTO | PromiseLike<ProductDataSourceDTO | null> | null;
  
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;
}
