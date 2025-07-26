import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from './response-customer.dto';

export class CustomerPaginationDto {
  @ApiProperty({
    description: 'List customers',
    type: CustomerResponseDto,
    isArray: true,
  })
  data: CustomerResponseDto[];
  @ApiProperty({ description: 'Total list' })
  total: number;
  @ApiProperty({ description: 'Page current' })
  page: number;
  @ApiProperty({ description: 'limit of records per page' })
  limit: number;
  @ApiProperty({ description: 'Total of pages' })
  totalPages: number;
}
