// payment-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlataformEnum } from '../enum/payment-plataform.enum';
import { PaymentStatusEnum } from '../enum/payment-status.enum';
import { PaymentTypeEnum } from '../enum/payment-type.enum';

export class PaymentResponseDto {
  @ApiProperty({ description: 'Unique identifier for the payment' })
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the order associated with the payment',
  })
  orderId: string;

  @ApiProperty({
    description: 'Unique identifier for the store associated with the payment',
  })
  storeId: string;

  @ApiProperty({ enum: PaymentTypeEnum, description: 'Type of payment' })
  paymentType: PaymentTypeEnum;

  @ApiProperty({
    enum: PaymentStatusEnum,
    description: 'Status of the payment',
  })
  status: PaymentStatusEnum;

  @ApiProperty({ description: 'Total amount of the payment' })
  total: number;

  @ApiProperty({
    description: 'Unique identifier for the payment in the external system',
  })
  externalId: string;

  @ApiProperty({ description: 'QR code for the payment' })
  qrCode: string;

  @ApiProperty({
    enum: PaymentPlataformEnum,
    description: 'Platform used for the payment',
  })
  plataform: PaymentPlataformEnum;

  @ApiProperty({ description: 'Date and time when the payment was created' })
  createdAt: Date;
}
