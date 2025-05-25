import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the customer',
    required: false,
  })
  @IsString()
  customerId?: string;

  @ApiProperty({
    description: 'Status of the order',
    required: true,
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Total price of the order',
    required: true,
  })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Unique identifier for the store',
  })
  @IsString()
  storeId: string;

  @ApiProperty({
    description: 'Unique identifier for the totem',
    required: false,
  })
  totemId?: string;

  @ApiProperty({
    description: 'List of order items',
    type: OrderItemResponseDto,
    required: true,
  })
  orderItems: OrderItemResponseDto[];

  @ApiProperty({
    description: 'Creation date of the order',
    type: Date,
    required: true,
  })
  createdAt: Date;
}
