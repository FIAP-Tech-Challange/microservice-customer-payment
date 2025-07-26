import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { OrderItem } from './order-item.entity';
import { CoreException } from 'src/common/exceptions/coreException';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Customer } from '../../customer/entities/customer.entity';

export enum OrderStatusEnum {
  PENDING = 'P',
  CANCELED = 'C',
  RECEIVED = 'R',
  IN_PROGRESS = 'E',
  READY = 'O',
  FINISHED = 'F',
}

interface OrderProps {
  id: string;
  customer?: Customer;
  customerId?: string | undefined;
  status: OrderStatusEnum;
  storeId: string;
  totemId?: string;
  orderItems: OrderItem[];
  createdAt: Date;
}

export class Order {
  private _id: string;
  private _customer?: Customer;
  private _customerId?: string | undefined;
  private _status: OrderStatusEnum;
  private _storeId: string;
  private _totemId?: string;
  private _orderItems: OrderItem[];
  private _createdAt: Date;

  private constructor(props: OrderProps) {
    this._id = props.id;
    this._customer = props.customer;
    this._customerId = props.customerId;
    this._status = props.status;
    this._storeId = props.storeId;
    this._totemId = props.totemId;
    this._orderItems = props.orderItems;
    this._createdAt = props.createdAt;
    this.validate();
  }

  private validate() {
    if (!this._id) throw new ResourceInvalidException('ID is required');
    if (!this._status) throw new ResourceInvalidException('Status is required');
    if (!this._storeId)
      throw new ResourceInvalidException('Store ID is required');
    if (!this._createdAt)
      throw new ResourceInvalidException('Created at date is required');
    if (this._orderItems.length === 0)
      throw new ResourceInvalidException('Order must have at least one item');

    const orderItemsIds = new Set(this._orderItems.map((item) => item.id));
    if (orderItemsIds.size !== this._orderItems.length) {
      throw new ResourceInvalidException(
        'Duplicated order item IDs are not allowed',
      );
    }
  }

  setToReceived(): void {
    if (this._status !== OrderStatusEnum.PENDING) {
      throw new ResourceInvalidException(
        'Order can only be set to received if it is pending',
      );
    }
    this._status = OrderStatusEnum.RECEIVED;
    this.validate();
  }

  setToInProgress(): void {
    if (this._status !== OrderStatusEnum.RECEIVED) {
      throw new ResourceInvalidException(
        'Order can only be started if it is received',
      );
    }
    this._status = OrderStatusEnum.IN_PROGRESS;
    this.validate();
  }

  setToReady(): void {
    if (this._status !== OrderStatusEnum.IN_PROGRESS) {
      throw new ResourceInvalidException(
        'Order can only be set to ready if it is in progress',
      );
    }
    this._status = OrderStatusEnum.READY;
    this.validate();
  }

  setToFinished(): void {
    if (this._status !== OrderStatusEnum.READY) {
      throw new ResourceInvalidException(
        'Order can only be set to finished if it is ready',
      );
    }
    this._status = OrderStatusEnum.FINISHED;
    this.validate();
  }

  setToCanceled(): void {
    if (this._status !== OrderStatusEnum.PENDING) {
      throw new ResourceInvalidException('Only pending orders can be canceled');
    }
    this._status = OrderStatusEnum.CANCELED;
    this.validate();
  }

  removeItem(itemId: string): CoreResponse<OrderItem> {
    try {
      const itemIndex = this._orderItems.findIndex(
        (item) => item.id === itemId,
      );
      if (itemIndex === -1) {
        throw new ResourceInvalidException('Order item not found');
      }

      if (this._status !== OrderStatusEnum.PENDING) {
        throw new ResourceInvalidException(
          'Order items can only be removed from pending orders',
        );
      }

      const [removedItem] = this._orderItems.splice(itemIndex, 1);
      this.validate();
      return { value: removedItem, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  associateCustomer(customer: Customer): CoreResponse<void> {
    try {
      if (
        this._status === OrderStatusEnum.FINISHED ||
        this._status === OrderStatusEnum.CANCELED
      ) {
        throw new ResourceInvalidException(
          'Cannot associate customer to an order that is finished or canceled',
        );
      }

      if (this._customer) {
        throw new ResourceInvalidException(
          'This order already has a customer associated',
        );
      }

      this._customer = customer;
      this.validate();
      return { value: undefined, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static create(
    props: Omit<OrderProps, 'id' | 'status' | 'createdAt'>,
  ): CoreResponse<Order> {
    try {
      const order = new Order({
        id: crypto.randomUUID(),
        status: OrderStatusEnum.PENDING,
        orderItems: props.orderItems,
        customerId: props.customerId,
        storeId: props.storeId,
        createdAt: new Date(),
      });
      return { value: order, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static restore(props: OrderProps): CoreResponse<Order> {
    try {
      const order = new Order(props);
      return { value: order, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
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
  get customer(): Customer | undefined {
    return this._customer;
  }
  get customerId(): string | undefined {
    return this._customerId;
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
  get orderItems(): OrderItem[] {
    return this._orderItems;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
}
