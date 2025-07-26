import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PaymentIdDto {
  @ApiProperty({
    description: 'The ID of the Payment',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
