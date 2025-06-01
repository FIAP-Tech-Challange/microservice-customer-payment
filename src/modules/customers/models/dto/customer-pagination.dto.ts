import { CustomerModel } from '../domain/customer.model';

export class CustomerPaginationDto {
  data: CustomerModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
