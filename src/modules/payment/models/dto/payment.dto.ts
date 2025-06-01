// payment-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlataformEnum } from '../enum/payment-plataform.enum';
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
    description: 'Unique identifier for the store associated with the payment',
    example: '0fa30d74-877b-4a5b-8cc3-cc72105b7015',
  })
  storeId: string;

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
    description: 'Unique identifier for the payment in the external system',
    example: '0fa30d74-877b-4a5b-8cc3-cc72105b7015',
  })
  externalId: string;

  @ApiProperty({
    description: 'QR code for the payment',
    example: '00020101021226930014BR.GOV.BCB.PIX0136FAKE-MOCK...',
  })
  qrCode: string;

  @ApiProperty({
    enum: PaymentPlataformEnum,
    description: 'Platform used for the payment',
    example: PaymentPlataformEnum.MP,
  })
  plataform: PaymentPlataformEnum;

  @ApiProperty({
    description: 'Date and time when the payment was created',
    example: new Date().toISOString(),
  })
  createdAt: Date;
}
