import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseDto } from './order-response.dto';

export class OrderSortedListDto {
  @ApiProperty({
    description: 'Total number of sorted orders',
    example: 10,
  })
  total: number;
  @ApiProperty({
    description: 'List of sorted order IDs',
    type: OrderResponseDto,
    isArray: true,
  })
  data: OrderResponseDto[];
}
