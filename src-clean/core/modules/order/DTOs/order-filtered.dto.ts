import { OrderDataSourceDto } from 'src-clean/common/dataSource/DTOs/orderDataSource.dto';

export interface OrderFilteredDto {
  data: OrderDataSourceDto[];
  total: number;
}
