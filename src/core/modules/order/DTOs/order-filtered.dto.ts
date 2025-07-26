import { OrderDataSourceDto } from 'src/common/dataSource/DTOs/orderDataSource.dto';

export interface OrderFilteredDto {
  total: number;
  data: OrderDataSourceDto[];
}
