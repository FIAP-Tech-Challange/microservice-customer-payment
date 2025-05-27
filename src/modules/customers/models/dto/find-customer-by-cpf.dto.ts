import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindCustomerByCpfDto {
  @ApiProperty({
    description: 'Customer CPF (with or without formatting)',
    example: '905.108.520-68',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  cpf: string;
}
