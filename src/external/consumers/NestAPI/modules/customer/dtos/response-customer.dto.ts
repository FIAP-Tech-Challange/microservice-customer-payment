import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    description: 'The ID of the customer',
    example: 'c84079b9-b1ba-4223-812f-d1f1435ea34d',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the customer',
    example: 'João Silva',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the customer',
    example: 'joao@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'The age of the customer',
    example: 30,
  })
  cpf: string;

  @ApiPropertyOptional({
    description: 'The store ID associated with the customer',
    example: 's84079b9-b1ba-4223-812f-d1f1435ea34d',
  })
  storeId?: string;
}