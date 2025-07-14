import { PaymentDataSourceDTO } from './DTOs/paymentDataSource.dto';
import { StoreDataSourceDTO } from './DTOs/storeDataSource.dto';
import { ProductDataSourceDTO } from './DTOs/productDataSource.dto';
import { CategoryDataSourceDTO } from './DTOs/categoryDataSource.dto';
import { OrderDataSourceDto } from './DTOs/orderDataSource.dto';
import { OrderPaginationDto } from 'src-clean/core/modules/order/DTOs/order-pagination.dto';

export interface DataSource {
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
  findProductByName(
    name: string,
  ): ProductDataSourceDTO | PromiseLike<ProductDataSourceDTO | null> | null;
  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null>;
  saveOrder(order: OrderDataSourceDto): Promise<void>;
  findOrderById(id: string): Promise<OrderDataSourceDto | null>;
  findByOrderItemId(id: string): Promise<OrderDataSourceDto | null>;
  deleteOrder(order: OrderDataSourceDto): Promise<void>;
  deleteOrderItem(orderItem: string): Promise<void>;
  getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderPaginationDto>;
}
