import { OrderModel } from '../domain/order.model';

export class OrderPaginationDomainDto {
  data: OrderModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
