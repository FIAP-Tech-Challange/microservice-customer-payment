import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CustomerIdDto {
  @ApiProperty({ description: 'The ID of the customer' })
  @IsUUID()
  id: string;
}