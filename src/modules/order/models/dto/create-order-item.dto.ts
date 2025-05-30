import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product being ordered',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the product being ordered',
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
