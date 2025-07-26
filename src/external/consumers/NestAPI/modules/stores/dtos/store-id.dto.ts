import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class StoreIdDto {
  @ApiProperty({
    description: 'Unique identifier for the store',
  })
  @IsUUID()
  id: string;
}
