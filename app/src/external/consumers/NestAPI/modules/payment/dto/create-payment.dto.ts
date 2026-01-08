import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The ID of the Order',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
