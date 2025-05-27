import {
  IsOptional,
  IsString,
  IsNumber,
  IsUrl,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Delicious Pizza',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 19.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Product status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: 'Product description',
    example: 'A delicious pizza with fresh ingredients.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Preparation time in minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prep_time: number;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/pizza.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}
