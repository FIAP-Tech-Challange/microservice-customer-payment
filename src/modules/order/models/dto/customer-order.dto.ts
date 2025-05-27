import { ApiProperty } from '@nestjs/swagger';

export class CustomerOrderDto {
  @ApiProperty({
    description: 'Unique identifier for the customer',
  })
  id: string;

  @ApiProperty({
    description: 'CPF of the customer',
  })
  cpf: string;

  @ApiProperty({
    description: 'Name of the customer',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the customer',
  })
  email: string;
}
