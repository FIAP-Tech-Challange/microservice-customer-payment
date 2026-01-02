import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlatformEnum } from '../enum/payment-platform.enum';
import { PaymentStatusEnum } from '../enum/payment-status.enum';
import { PaymentTypeEnum } from '../enum/payment-type.enum';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the payment',
    example: '0fa30d74-877b-4a5b-8cc3-cc72105b7015',
  })
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the order associated with the payment',
    example: '0fa30d74-877b-4a5b-8cc3-cc72105b7015',
  })
  orderId: string;

  @ApiProperty({
    description: 'Unique identifier for the resource in the payment provider',
    example: '0fa30d74-877b-4a5b-8cc3-cc72105b7015',
  })
  externalId: string;

  @ApiProperty({
    enum: PaymentTypeEnum,
    description: 'Type of payment',
    example: PaymentTypeEnum.QR,
  })
  paymentType: PaymentTypeEnum;

  @ApiProperty({
    enum: PaymentStatusEnum,
    description: 'Status of the payment',
    example: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @ApiProperty({ description: 'Total amount of the payment', example: 50.0 })
  total: number;

  @ApiProperty({
    description: 'QR code for the payment',
    example: '00020101021226930014BR.GOV.BCB.PIX0136FAKE-MOCK...',
  })
  qrCode: string;

  @ApiProperty({
    enum: PaymentPlatformEnum,
    description: 'Platform used for the payment',
    example: PaymentPlatformEnum.MP,
  })
  platform: PaymentPlatformEnum;
}
