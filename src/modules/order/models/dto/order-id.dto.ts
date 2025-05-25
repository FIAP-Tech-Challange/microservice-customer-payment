import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class OrderIdDto {
  @ApiProperty({
    description: 'The ID of the order',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
