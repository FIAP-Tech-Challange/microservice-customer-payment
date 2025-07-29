import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Delicious Pizza',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 19.99,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'A delicious pizza with fresh ingredients.',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Preparation time in minutes',
    example: 30,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  prep_time: number;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/pizza.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image_url?: string;
}
