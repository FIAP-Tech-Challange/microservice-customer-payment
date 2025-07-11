import { CustomerDTO } from './customer.dto';

export interface CustomerPaginationDTO {
  customers: CustomerDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
