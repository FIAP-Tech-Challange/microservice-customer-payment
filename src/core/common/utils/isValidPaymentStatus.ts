import { PaymentStatusEnum } from 'src/core/modules/payment/enums/paymentStatus.enum';

export function isValidPaymentStatus(
  value: string,
): value is PaymentStatusEnum {
  return Object.values(PaymentStatusEnum).includes(value as PaymentStatusEnum);
}
