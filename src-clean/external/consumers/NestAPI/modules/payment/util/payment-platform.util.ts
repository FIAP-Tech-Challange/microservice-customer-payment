import { PaymentPlatformEnum } from '../enum/payment-platform.enum';

export function getPaymentPlatform(value: string): PaymentPlatformEnum {
  if (
    Object.values(PaymentPlatformEnum).includes(value as PaymentPlatformEnum)
  ) {
    return value as PaymentPlatformEnum;
  }

  throw new Error(`Invalid payment platform: ${value}`);
}
