import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the store where the order is placed',
  })
  @IsOptional()
  @IsUUID()
  storeId: string;

  @ApiProperty({
    description: 'ID of the totem where the order is placed',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  totemId?: string;

  @ApiProperty({
    description: 'List of order items',
    required: true,
    type: [CreateOrderItemDto],
    isArray: true,
    example: [
      {
        productId: '12345',
        quantity: 2,
        unitPrice: 19.99,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
