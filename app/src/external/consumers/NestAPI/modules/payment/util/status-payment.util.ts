import { PaymentStatusEnum } from '../enum/payment-status.enum';

export const statusOptionsMessage = Object.entries(PaymentStatusEnum)
  .map(([key, value]) => `${value} (${key})`)
  .join(', ');

export const getStatusName = (value: string) => {
  const entry = Object.entries(PaymentStatusEnum).find(
    ([val]) => val === value,
  );
  return entry ? entry[0] : undefined;
};
