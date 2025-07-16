import { PaymentTypeEnum } from 'src-clean/core/modules/payment/enums/paymentType.enum';

export function isValidPaymentType(value: string): value is PaymentTypeEnum {
  return Object.values(PaymentTypeEnum).includes(value as PaymentTypeEnum);
}
