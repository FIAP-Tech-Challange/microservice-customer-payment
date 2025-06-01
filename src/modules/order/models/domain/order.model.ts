import { OrderStatusEnum } from '../enum/order-status.enum';
import { OrderItemModel } from './order-item.model';
import { CustomerModel } from 'src/modules/customers/models/domain/customer.model';

interface OrderProps {
  id: string;
  customer?: CustomerModel;
  status: OrderStatusEnum;
  storeId: string;
  totemId?: string;
  orderItems: OrderItemModel[];
  createdAt: Date;
}

export class OrderModel {
  private _id: string;
  private _customer?: CustomerModel;
  private _status: OrderStatusEnum;
  private _storeId: string;
  private _totemId?: string;
  private _orderItems: OrderItemModel[];
  private _createdAt: Date;

  private constructor(props: OrderProps) {
    this._id = props.id;
    this._customer = props.customer;
    this._status = props.status;
    this._storeId = props.storeId;
    this._totemId = props.totemId;
    this._orderItems = props.orderItems;
    this._createdAt = props.createdAt;
    this.validate();
  }

  private validate() {
    if (!this._id) throw new Error('ID is required');
    if (!this._status) throw new Error('Status is required');
    if (!this._storeId) throw new Error('Store ID is required');
    if (!this._createdAt) throw new Error('Created at date is required');
    if (this._orderItems.length === 0)
      throw new Error('Order must have at least one item');

    const orderItemsIds = new Set(this._orderItems.map((item) => item.id));
    if (orderItemsIds.size !== this._orderItems.length) {
      throw new Error('Duplicated order item IDs are not allowed');
    }
  }

  setToReceived(): void {
    if (this._status !== OrderStatusEnum.PENDING) {
      throw new Error('Order can only be set to received if it is pending');
    }
    this._status = OrderStatusEnum.RECEIVED;
    this.validate();
  }

  setToInProgress(): void {
    if (this._status !== OrderStatusEnum.RECEIVED) {
      throw new Error('Order can only be started if it is received');
    }
    this._status = OrderStatusEnum.IN_PROGRESS;
    this.validate();
  }

  setToReady(): void {
    if (this._status !== OrderStatusEnum.IN_PROGRESS) {
      throw new Error('Order can only be set to ready if it is in progress');
    }
    this._status = OrderStatusEnum.READY;
    this.validate();
  }

  setToFinished(): void {
    if (this._status !== OrderStatusEnum.READY) {
      throw new Error('Order can only be set to finished if it is ready');
    }
    this._status = OrderStatusEnum.FINISHED;
    this.validate();
  }

  setToCanceled(): void {
    if (this._status !== OrderStatusEnum.PENDING) {
      throw new Error('Only pending orders can be canceled');
    }
    this._status = OrderStatusEnum.CANCELED;
    this.validate();
  }

  removeItem(itemId: string): OrderItemModel {
    const itemIndex = this._orderItems.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Order item not found');
    }

    if (this._status !== OrderStatusEnum.PENDING) {
      throw new Error('Order items can only be removed from pending orders');
    }

    const [removedItem] = this._orderItems.splice(itemIndex, 1);
    this.validate();
    return removedItem;
  }

  associateCustomer(customer: CustomerModel): void {
    if (
      this._status === OrderStatusEnum.FINISHED ||
      this._status === OrderStatusEnum.CANCELED
    ) {
      throw new Error(
        'Cannot associate customer to an order that is finished or canceled',
      );
    }

    if (this._customer) {
      throw new Error('This order already has a customer associated');
    }

    this._customer = customer;
    this.validate();
  }

  static create(
    props: Omit<OrderProps, 'id' | 'status' | 'createdAt'>,
  ): OrderModel {
    return new OrderModel({
      id: crypto.randomUUID(),
      status: OrderStatusEnum.PENDING,
      orderItems: props.orderItems,
      customer: props.customer,
      storeId: props.storeId,
      createdAt: new Date(),
    });
  }

  static restore(props: OrderProps): OrderModel {
    return new OrderModel(props);
  }

  get totalPrice(): number {
    return this._orderItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0,
    );
  }

  get id(): string {
    return this._id;
  }
  get customer(): CustomerModel | undefined {
    return this._customer;
  }
  get status(): OrderStatusEnum {
    return this._status;
  }
  get storeId(): string {
    return this._storeId;
  }
  get totemId(): string | undefined {
    return this._totemId;
  }
  get orderItems(): OrderItemModel[] {
    return this._orderItems;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
