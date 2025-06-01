import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product being ordered',
  })
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product being ordered',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
