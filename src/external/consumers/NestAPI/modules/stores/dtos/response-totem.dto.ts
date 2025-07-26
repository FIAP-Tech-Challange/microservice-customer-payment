import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdUuidDto } from '../../../shared/dto/response-id-uuid.dto';

export class ResponseTotemDto extends ResponseIdUuidDto {
  @ApiProperty({
    description: 'Totem name',
    example: 'Totem 01',
  })
  name: string;

  @ApiProperty({
    description: 'Totem access token',
    example: '84079b90-b1ba-4223-812f-d1f1435ea34d',
  })
  tokenAccess: string;
}
