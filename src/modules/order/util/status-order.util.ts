import { OrderStatusEnum } from '../models/enum/order-status.enum';

export const statusOptionsMessage = Object.entries(OrderStatusEnum)
  .map(([key, value]) => `${value} (${key})`)
  .join(', ');

export const getStatusName = (value: string) => {
  const entry = Object.entries(OrderStatusEnum).find(
    ([, enumValue]) => (enumValue as string) === value,
  );
  return entry ? entry[0] : undefined;
};
