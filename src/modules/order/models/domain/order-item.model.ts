interface OrderItemProps {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;
}

export class OrderItemModel {
  id: string;
  orderId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: Date;

  private constructor(props: OrderItemProps) {
    this.id = props.id;
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.unitPrice = props.unitPrice;
    this.quantity = props.quantity;
    this.subtotal = props.subtotal;
    this.createdAt = props.createdAt;
  }

  private validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.orderId) {
      throw new Error('Order ID is required');
    }
    if (!this.productId) {
      throw new Error('Product ID is required');
    }
    if (this.unitPrice <= 0) {
      throw new Error('Unit price must be greater than zero');
    }
    if (this.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (this.subtotal <= 0) {
      throw new Error('Subtotal must be greater than zero');
    }
    if (!this.createdAt) {
      throw new Error('Created at date is required');
    }
    if (this.createdAt > new Date()) {
      throw new Error('Created at date cannot be in the future');
    }
  }

  static create(
    props: Omit<OrderItemProps, 'id' | 'createdAt' | 'subtotal'>,
  ): OrderItemModel {
    const orderItem = new OrderItemModel({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      subtotal: props.unitPrice * props.quantity,
    });
    orderItem.validate();
    return orderItem;
  }

  static fromProps(props: OrderItemProps): OrderItemModel {
    const model = new OrderItemModel(props);
    model.validate();
    return model;
  }
}
