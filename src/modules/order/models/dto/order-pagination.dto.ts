import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseDto } from './order-response.dto';

export class OrderPaginationDto {
  @ApiProperty({
    description: 'List orders',
    type: [OrderResponseDto],
  })
  data: OrderResponseDto[];

  @ApiProperty({
    description: 'Total number of orders',
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    description: 'Number of orders per page',
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indicates if there is a next page',
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
  })
  hasPreviousPage: boolean;
}
