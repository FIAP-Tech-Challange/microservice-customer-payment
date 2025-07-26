import { OrderDataSourceDto } from 'src/common/dataSource/DTOs/orderDataSource.dto';

export interface OrderDataSourcePaginationDto {
  data: OrderDataSourceDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
