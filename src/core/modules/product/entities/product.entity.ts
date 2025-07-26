import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { generateUUID } from 'src/core/common/utils/uuid.helper';

interface ProductProps {
  id: string;
  name: string;
  price: number;
  description: string;
  prepTime: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
}

export class Product {
  private _id: string;
  private _name: string;
  private _price: number;
  private _description: string;
  private _prepTime: number;
  private _imageUrl?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _storeId: string;
  tokenAccess: string;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
    this._description = props.description;
    this._prepTime = props.prepTime;
    this._imageUrl = props.imageUrl;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._storeId = props.storeId;

    this.validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }

  get description() {
    return this._description;
  }

  get prepTime() {
    return this._prepTime;
  }

  get imageUrl() {
    return this._imageUrl;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get storeId() {
    return this._storeId;
  }

  private validate() {
    if (!this._name || this._name.length < 3) {
      throw new ResourceInvalidException(
        'Product name must be at least 3 characters long.',
      );
    }
    if (this._price <= 0) {
      throw new ResourceInvalidException(
        'Product price must be greater than zero.',
      );
    }
    if (this._prepTime < 0) {
      throw new ResourceInvalidException(
        'Product prep time cannot be negative.',
      );
    }
    if (!this._storeId) {
      throw new ResourceInvalidException(
        'Store ID is required for the product.',
      );
    }
  }

  static create(props: {
    name: string;
    price: number;
    description?: string;
    prepTime: number;
    imageUrl?: string;
    storeId: string;
  }): CoreResponse<Product> {
    const id = generateUUID();
    const now = new Date();

    try {
      const product = new Product({
        id,
        name: props.name,
        price: props.price,
        description: props.description || '',
        prepTime: props.prepTime,
        imageUrl: props.imageUrl,
        createdAt: now,
        updatedAt: now,
        storeId: props.storeId,
      });

      return { value: product, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static restore(props: ProductProps): CoreResponse<Product> {
    try {
      const product = new Product(props);
      return { value: product, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }
}
