import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Delicious Pizza',
  })
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 19.99,
  })
  price: number;

  @ApiProperty({
    description: 'Product status',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'Product description',
    example: 'A delicious pizza with fresh ingredients.',
  })
  description: string;

  @ApiProperty({
    description: 'Preparation time in minutes',
    example: 30,
  })
  prep_time: number;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/pizza.jpg',
  })
  image_url: string;

  @ApiProperty({
    description: 'Date when the product was created',
    example: '2025-05-19T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Date when the product was last updated',
    example: '2025-05-20T12:00:00Z',
  })
  updated_at: Date;
}
