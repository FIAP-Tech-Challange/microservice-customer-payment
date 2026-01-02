import { PaymentPlatformEnum } from '../enums/paymentPlatform.enum';
import { PaymentStatusEnum } from '../enums/paymentStatus.enum';
import { PaymentTypeEnum } from '../enums/paymentType.enum';

export interface PaymentDTO {
  id: string;
  orderId: string;
  externalId: string;
  total: number;
  qrCode: string;
  platform: PaymentPlatformEnum;
  status: PaymentStatusEnum;
  paymentType: PaymentTypeEnum;
  storeId: string;
}
