import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { GeneralDataSource } from './general/general.dataSource';
import { PaymentDataSource } from './payment/payment.dataSource';
import { PaymentDataSourceDTO } from 'src-clean/common/dataSource/DTOs/paymentDataSource.dto';
import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';
import { OrderPaginationDto } from 'src/modules/order/models/dto/order-pagination.dto';
import { CategoryDataSourceDTO } from 'src-clean/common/dataSource/DTOs/categoryDataSource.dto';
import { ProductDataSourceDTO } from 'src-clean/common/dataSource/DTOs/productDataSource.dto';
import { OrderDataSourcePaginationDto } from 'src-clean/common/dataSource/DTOs/orderDataSourcePagination.dto';

export class DataSourceProxy implements DataSource {
  constructor(
    private generalDataSource: GeneralDataSource,
    private paymentDataSource: PaymentDataSource,
  ) {}
  saveCategory(categoryDTO: void): unknown {
    throw new Error('Method not implemented.');
  }
  findCategoryById(id: string): Promise<CategoryDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findCategoryByName(name: string): Promise<CategoryDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  findProductById(id: string): Promise<ProductDataSourceDTO | null> {
    throw new Error('Method not implemented.');
  }
  saveProduct(product: ProductDataSourceDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findProductByName(
    name: string,
  ): ProductDataSourceDTO | PromiseLike<ProductDataSourceDTO | null> | null {
    throw new Error('Method not implemented.');
  }

  saveOrder(order: OrderDataSourceDto): Promise<void> {
    return this.generalDataSource.saveOrder(order);
  }

  findOrderById(id: string): Promise<OrderDataSourceDto | null> {
    return this.generalDataSource.findOrderById(id);
  }
  findByOrderItemId(id: string): Promise<OrderDataSourceDto | null> {
    return this.generalDataSource.findByOrderItemId(id);
  }

  deleteOrder(order: OrderDataSourceDto): Promise<void> {
    return this.generalDataSource.deleteOrder(order);
  }

  deleteOrderItem(orderItem: string): Promise<void> {
    return this.generalDataSource.deleteOrderItem(orderItem);
  }

  getAllOrders(
    page: number,
    limit: number,
    status: string,
    storeId: string,
  ): Promise<OrderDataSourcePaginationDto> {
    return this.generalDataSource.getAllOrders(page, limit, status, storeId);
  }

  findStoreById(id: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreById(id);
  }

  findStoreByCnpj(cnpj: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByCnpj(cnpj);
  }

  findStoreByName(name: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByName(name);
  }

  getPayment(paymentId: string): Promise<PaymentDataSourceDTO | null> {
    return this.paymentDataSource.getPayment(paymentId);
  }

  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    return this.generalDataSource.findStoreByEmail(email);
  }

  saveStore(store: StoreDataSourceDTO): Promise<void> {
    return this.generalDataSource.saveStore(store);
  }
}
