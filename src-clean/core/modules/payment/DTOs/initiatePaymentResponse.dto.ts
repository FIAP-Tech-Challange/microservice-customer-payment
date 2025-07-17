import { PaymentPlatformEnum } from '../enums/paymentPlatform.enum';

export type InitiatePaymentResponseDTO = {
  id: string;
  externalId: string;
  platform: PaymentPlatformEnum;
  orderId: string;
  qrCode: string;
};
