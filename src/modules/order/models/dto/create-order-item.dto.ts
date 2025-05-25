import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

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

  @ApiProperty({
    description: 'Unit price of the product being ordered',
  })
  @Transform(({ value }: { value: string | number }) =>
    parseFloat(value as string),
  )
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number with up to 2 decimal places' },
  )
  @IsPositive({ message: 'Price must be a positive number' })
  unitPrice: number;
}
