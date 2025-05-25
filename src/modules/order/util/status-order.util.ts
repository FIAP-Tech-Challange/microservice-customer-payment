import { OrderStatusEnum } from '../models/enum/order-status.enum';

export const statusOptionsMessage = Object.entries(OrderStatusEnum)
  .map(([key, value]) => `${value} (${key})`)
  .join(', ');

export const getStatusName = (value: string) => {
  const entry = Object.entries(OrderStatusEnum).find(([val]) => val === value);
  return entry ? entry[0] : undefined;
};
