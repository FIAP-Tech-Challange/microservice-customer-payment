import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindProductByIdDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;
}