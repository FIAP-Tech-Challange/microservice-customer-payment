import { ApiProperty } from '@nestjs/swagger';
import { PaymentPlatformEnum } from '../enum/payment-platform.enum';

export class CreatePaymentResponseDto {
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
    enum: PaymentPlatformEnum,
    description: 'Platform used for the payment',
    example: PaymentPlatformEnum.MP,
  })
  platform: PaymentPlatformEnum;
}
