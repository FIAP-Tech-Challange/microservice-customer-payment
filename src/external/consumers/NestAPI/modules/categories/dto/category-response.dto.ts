import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the Categories',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  id: string;

  @ApiProperty({
    description: 'Name product',
    example: 'Hamburguer',
  })
  name: string;

  @ApiProperty({
    description: 'Price the product',
    example: 15.99,
  })
  price: number;

  @ApiProperty({
    description: 'Description the product',
    example: 'two meats, salad and sauce',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'preparation time',
    example: 20,
  })
  prepTime: number;

  @ApiProperty({
    description: 'preparation time',
    example: 'http://google.com/hamburguer.jpeg',
    required: false,
  })
  imageUrl?: string;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the Categories',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  id: string;

  @ApiProperty({
    description: 'Name category',
    example: 'Lanche',
  })
  name: string;

  @ApiProperty({
    description: 'Products in Category',
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];
}
