import { ApiProperty } from '@nestjs/swagger';

export class CustomerOrderDto {
  @ApiProperty({
    description: 'Unique identifier for the customer',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  id: string;

  @ApiProperty({
    description: 'CPF of the customer',
    example: '11122233399',
  })
  cpf: string;

  @ApiProperty({
    description: 'Name of the customer',
    example: 'Cristiano Ronaldo',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the customer',
    example: 'email@email.com',
  })
  email: string;
}
