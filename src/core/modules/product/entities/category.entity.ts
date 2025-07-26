import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { Product } from './product.entity';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { generateUUID } from 'src/core/common/utils/uuid.helper';

interface CategoryProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  products: Product[];
  storeId: string;
}

export class Category {
  private _id: string;
  private _name: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _products: Product[];
  private _storeId: string;

  private constructor(props: CategoryProps) {
    this._id = props.id;
    this._name = props.name;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._products = props.products;
    this._storeId = props.storeId;

    this.validate();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get products() {
    return this._products;
  }

  get storeId() {
    return this._storeId;
  }

  private validate() {
    if (!this._id) {
      throw new ResourceInvalidException('Category must have an id');
    }
    if (!this._name || this._name.length < 3) {
      throw new ResourceInvalidException(
        'Category name must be at least 3 characters long',
      );
    }
    if (!this._createdAt) {
      throw new ResourceInvalidException('Category must have a creation date');
    }
    if (!this._updatedAt) {
      throw new ResourceInvalidException('Category must have an update date');
    }
    if (!this._storeId) {
      throw new ResourceInvalidException('Category must belong to a store');
    }
  }

  addProduct(product: Product): CoreResponse<undefined> {
    try {
      this._products.forEach((p) => {
        if (p.name === product.name) {
          throw new ResourceConflictException(
            'Product with this name already exists in the category',
          );
        }

        if (p.id === product.id) {
          throw new ResourceConflictException(
            'Product with this id already exists in the category',
          );
        }
      });

      this._products.push(product);
      this._updatedAt = new Date();
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  removeProduct(productId: string): CoreResponse<undefined> {
    try {
      const productIndex = this._products.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        throw new ResourceConflictException(
          'Product with this id does not exist in the category',
        );
      }

      this._products.splice(productIndex, 1);
      this._updatedAt = new Date();
      this.validate();
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static create(props: {
    name: string;
    storeId: string;
  }): CoreResponse<Category> {
    const id = generateUUID();
    const now = new Date();

    try {
      const category = new Category({
        id,
        name: props.name,
        storeId: props.storeId,
        products: [],
        createdAt: now,
        updatedAt: now,
      });

      return { value: category, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static restore(props: CategoryProps): CoreResponse<Category> {
    try {
      const category = new Category(props);
      return { value: category, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }
}
