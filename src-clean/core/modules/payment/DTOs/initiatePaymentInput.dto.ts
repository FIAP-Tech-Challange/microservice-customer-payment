import { PaymentTypeEnum } from '../enums/paymentType.enum';

export type InitiatePaymentInputDTO = {
  orderId: string;
  storeId: string;
  paymentType: PaymentTypeEnum;
};
