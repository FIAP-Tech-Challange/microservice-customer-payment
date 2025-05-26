import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from './customer-response.dto';

export class CustomerListResponseDto {
  @ApiProperty({
    description: 'Lista de clientes',
    type: [CustomerResponseDto],
    isArray: true,
  })
  customers: CustomerResponseDto[];
}
