import { IsNotEmpty, IsString, IsNumber, IsUrl, IsIn } from 'class-validator';
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
  price: number;

  @ApiProperty({
    description: 'Product status',
    example: 'active',
    required: false,
    enum: ['active', 'inactive'],
  })
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;

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
  image_url?: string;

  @ApiProperty({
    description: 'Category ID of the product',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty({
    description: 'Store ID where the product is available',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  store_id: number;
}