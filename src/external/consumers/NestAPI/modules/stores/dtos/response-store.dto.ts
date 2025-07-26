import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoreIdDto } from './store-id.dto';
import { ResponseTotemDto } from './response-totem.dto';

export class ResponseStoreDto extends StoreIdDto {
  @ApiProperty({
    description: 'Name company',
    example: 'Snack Bar Fiap LTDA',
  })
  name: string;

  @ApiProperty({
    description: 'Name company',
    example: 'Snack Bar Fiap',
  })
  fantasyName: string;

  @ApiProperty({
    description: 'E-mail field company',
    example: 'email@gmail.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Contact telephone number',
    example: '5521999999999',
  })
  phone?: string;

  @ApiProperty({
    description: 'CNPJ field company',
    example: '00000000000000',
  })
  cnpj: string;

  @ApiProperty({
    description: 'Totems linked in Store',
    type: ResponseTotemDto,
    example: {
      id: '84079b90-b1ba-4223-812f-d1f1435ea34d',
      name: 'totem 01',
      tokenAccess: '525520790-b1ba-4223-812f-d1f1435ea34d',
    },
  })
  totems: ResponseTotemDto[];
}
