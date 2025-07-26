import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';

interface OrderItemProps {
  id: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  createdAt: Date;
}

export class OrderItem {
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
      throw new ResourceInvalidException('ID is required');
    }
    if (!this._productId) {
      throw new ResourceInvalidException('Product ID is required');
    }
    if (this._unitPrice <= 0) {
      throw new ResourceInvalidException(
        'Unit price must be greater than zero',
      );
    }
    if (this._quantity <= 0) {
      throw new ResourceInvalidException('Quantity must be greater than zero');
    }
    if (!this._createdAt) {
      throw new ResourceInvalidException('Created at date is required');
    }
  }

  static create(
    props: Omit<OrderItemProps, 'id' | 'createdAt'>,
  ): CoreResponse<OrderItem> {
    try {
      const orderItem = new OrderItem({
        id: crypto.randomUUID(),
        productId: props.productId,
        unitPrice: props.unitPrice,
        quantity: props.quantity,
        createdAt: new Date(),
      });
      return { value: orderItem, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static restore(props: OrderItemProps): CoreResponse<OrderItem> {
    try {
      const ordeItem = new OrderItem(props);
      return { value: ordeItem, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
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
