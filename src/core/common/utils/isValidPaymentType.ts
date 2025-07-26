import { PaymentTypeEnum } from 'src/core/modules/payment/enums/paymentType.enum';

export function isValidPaymentType(value: string): value is PaymentTypeEnum {
  return Object.values(PaymentTypeEnum).includes(value as PaymentTypeEnum);
}
