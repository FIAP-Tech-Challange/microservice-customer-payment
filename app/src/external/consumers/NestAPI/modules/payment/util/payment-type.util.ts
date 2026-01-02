import { PaymentTypeEnum } from '../enum/payment-type.enum';

export function getPaymentType(value: string): PaymentTypeEnum {
  if (Object.values(PaymentTypeEnum).includes(value as PaymentTypeEnum)) {
    return value as PaymentTypeEnum;
  }

  throw new Error(`Invalid payment type: ${value}`);
}
