import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class OrderItemResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order item',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the product',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product in the order item',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product in the order item',
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Total price of the order item',
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
