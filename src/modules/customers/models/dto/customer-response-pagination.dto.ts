import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from './customer-response.dto';

export class CustomerResponsePaginationDto {
  @ApiProperty({
    description: 'List Customers',
    type: [CustomerResponseDto],
  })
  data: CustomerResponseDto[];

  @ApiProperty({
    description: 'Total number of customers',
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    description: 'Number of customers per page',
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
