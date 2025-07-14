import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';

export interface OrderPaginationDto {
  data: OrderDataSourceDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
