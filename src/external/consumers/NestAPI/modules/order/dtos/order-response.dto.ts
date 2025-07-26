import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { OrderItemResponseDto } from './order-item-response.dto';
import { OrderStatusEnum } from 'src/core/modules/order/entities/order.entity';
import { CustomerResponseDto } from '../../customer/dtos/response-customer.dto';

export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Customer information',
    required: false,
    type: CustomerResponseDto,
  })
  customer?: CustomerResponseDto;

  @ApiProperty({
    description: 'Status of the order',
    required: true,
    example: OrderStatusEnum.PENDING,
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Total price of the order',
    required: true,
    example: 50.0,
  })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Unique identifier for the store',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  @IsString()
  storeId: string;

  @ApiProperty({
    description: 'Unique identifier for the totem',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
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
