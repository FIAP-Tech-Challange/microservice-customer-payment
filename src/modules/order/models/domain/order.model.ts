import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderItemModel } from './order-item.model';

interface OrderProps {
  id: string;
  customerId?: string | undefined;
  status: string;
  totalPrice?: number | undefined;
  storeId: string;
  totemId?: string | undefined;
  orderItems?: OrderItemModel[];
  createdAt: Date;
}
export class OrderModel {
  id: string;
  customerId?: string;
  status: string;
  totalPrice?: number;
  storeId: string;
  totemId?: string;
  orderItems?: OrderItemModel[];
  createdAt: Date;

  private constructor(props: OrderProps) {
    this.id = props.id;
    this.customerId = props.customerId ?? undefined;
    this.status = props.status;
    this.totalPrice = props.totalPrice ?? 0;
    this.storeId = props.storeId;
    this.totemId = props.totemId ?? undefined;
    this.orderItems = props.orderItems;
    this.createdAt = props.createdAt;
  }

  private validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.status) {
      throw new Error('Status is required');
    }
    if (
      (this.totalPrice === undefined || this.totalPrice <= 0) &&
      this.orderItems &&
      this.orderItems.length > 0
    ) {
      throw new Error('Total price must be greater than zero');
    }
    if (!this.storeId) {
      throw new Error('Store ID is required');
    }
    if (!this.createdAt) {
      throw new Error('Created at date is required');
    }
    if (this.createdAt > new Date()) {
      throw new Error('Created at date cannot be in the future');
    }
  }

  static addOrderItens(
    order: OrderModel,
    orderItems: OrderItemModel[],
  ): OrderModel {
    const orderWithItems = new OrderModel({
      ...order,
      orderItems: orderItems,
      totalPrice: orderItems.reduce(
        (acc, item) => acc + item.unitPrice * item.quantity,
        0,
      ),
    });
    orderWithItems.validate();
    return orderWithItems;
  }

  static create(
    props: Omit<OrderProps, 'id' | 'status' | 'createdAt'>,
  ): OrderModel {
    const order = new OrderModel({
      ...props,
      id: crypto.randomUUID(),
      status: OrderStatusEnum.PENDING,
      createdAt: new Date(),
      totalPrice:
        props.orderItems && props.orderItems.length > 0 ? props.totalPrice : 0,
    });
    order.validate();
    return order;
  }

  static fromProps(props: OrderProps): OrderModel {
    const model = new OrderModel(props);
    model.validate();
    return model;
  }
}
