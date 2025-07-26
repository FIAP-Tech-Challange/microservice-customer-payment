import { PaymentPlatformEnum } from 'src/core/modules/payment/enums/paymentPlatform.enum';

export function isValidPaymentPlatform(
  value: string,
): value is PaymentPlatformEnum {
  return Object.values(PaymentPlatformEnum).includes(
    value as PaymentPlatformEnum,
  );
}
