import { IsEnum } from 'class-validator';
import { PaymentStatusEnum } from '../enum/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

const statusOptionsMessage = Object.entries(PaymentStatusEnum)
  .map(([key, value]) => `${value} (${key})`)
  .join(', ');

export class UpdateStatusPaymentDto {
  @ApiProperty({
    description: 'The status of the payment',
    enum: PaymentStatusEnum,
  })
  @IsEnum(PaymentStatusEnum, {
    message: `status must be one of the following values: ${statusOptionsMessage}`,
  })
  status: PaymentStatusEnum;
}
