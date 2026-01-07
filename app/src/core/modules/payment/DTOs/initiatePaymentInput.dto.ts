import { PaymentTypeEnum } from '../enums/paymentType.enum';

export type InitiatePaymentInputDTO = {
  orderId: string;
  totalPrice?: number;
  storeId: string;
  paymentType: PaymentTypeEnum;
};
