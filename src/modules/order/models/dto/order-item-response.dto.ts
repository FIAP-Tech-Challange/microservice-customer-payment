import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order item',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product in the order item',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product in the order item',
    example: 20.0,
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Total price of the order item',
    example: 40.0,
  })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({
    description: 'Creation date of the order item',
    type: Date,
  })
  @IsDate()
  createdAt: Date;
}
