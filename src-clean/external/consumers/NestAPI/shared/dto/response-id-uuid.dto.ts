import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ResponseIdUuidDto {
  @ApiProperty({
    description: 'Unique identifier',
  })
  @IsUUID()
  id: string;
}
