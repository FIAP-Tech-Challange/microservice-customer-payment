interface OrderItemProps {
  id: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  createdAt: Date;
}

export class OrderItemModel {
  private _id: string;
  private _productId: string;
  private _unitPrice: number;
  private _quantity: number;
  private _createdAt: Date;

  private constructor(props: OrderItemProps) {
    this._id = props.id;
    this._productId = props.productId;
    this._unitPrice = props.unitPrice;
    this._quantity = props.quantity;
    this._createdAt = props.createdAt;
    this.validate();
  }

  private validate() {
    if (!this._id) {
      throw new Error('ID is required');
    }
    if (!this._productId) {
      throw new Error('Product ID is required');
    }
    if (this._unitPrice <= 0) {
      throw new Error('Unit price must be greater than zero');
    }
    if (this._quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (!this._createdAt) {
      throw new Error('Created at date is required');
    }
  }

  static create(
    props: Omit<OrderItemProps, 'id' | 'createdAt'>,
  ): OrderItemModel {
    return new OrderItemModel({
      id: crypto.randomUUID(),
      productId: props.productId,
      unitPrice: props.unitPrice,
      quantity: props.quantity,
      createdAt: new Date(),
    });
  }

  static restore(props: OrderItemProps): OrderItemModel {
    return new OrderItemModel(props);
  }

  get id() {
    return this._id;
  }
  get productId() {
    return this._productId;
  }
  get unitPrice() {
    return this._unitPrice;
  }
  get quantity() {
    return this._quantity;
  }
  get createdAt() {
    return this._createdAt;
  }
  get subtotal() {
    return this._unitPrice * this._quantity;
  }
}
