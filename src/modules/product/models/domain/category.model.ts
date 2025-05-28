import { ProductModel } from './product.model';

interface CategoryModelProps {
  id: string;
  name: string;
  isActive: boolean;
  products: ProductModel[];
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
}

export class CategoryModel {
  private _id: string;
  private _name: string;
  private _isActive: boolean;
  private _products: ProductModel[];
  private _createdAt: Date;
  private _updatedAt: Date;
  private _storeId: string;

  private constructor(props: CategoryModelProps) {
    this._id = props.id;
    this._name = props.name;
    this._isActive = props.isActive;
    this._products = props.products;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._storeId = props.storeId;
    this.validate();
  }

  validate() {
    if (!this._id) throw new Error('ID is required');
    if (this._name.length < 3)
      throw new Error('Category name must be at least 3 characters long.');
    if (this._name.length > 255)
      throw new Error('Category name must be at most 255 characters long.');
    if (!this._createdAt) throw new Error('CreatedAt is required');
    if (!this._updatedAt) throw new Error('UpdatedAt is required');
    if (!this._products) throw new Error('Products array is required');
    if (this._isActive !== !!this._isActive)
      throw new Error('isActive must be a boolean value.');
    if (!this._storeId) throw new Error('Store ID is required');
  }

  addProduct(product: ProductModel): void {
    if (product.store_id !== this._storeId) {
      throw new Error(
        `Product with ID ${product.id} does not belong to this category's store.`,
      );
    }

    this._products.push(product);
    this._updatedAt = new Date();
    this.validate();
  }

  removeProduct(product: ProductModel): void {
    const productIndex = this._products.findIndex((p) => p.id === product.id);

    if (productIndex === -1) {
      throw new Error(`Product with ID ${product.id} not found in category.`);
    }

    this._products.splice(productIndex, 1);
    this._updatedAt = new Date();
    this.validate();
  }

  public static create(
    props: Omit<
      CategoryModelProps,
      'id' | 'products' | 'createdAt' | 'updatedAt' | 'isActive'
    >,
  ): CategoryModel {
    const now = new Date();

    return new CategoryModel({
      id: crypto.randomUUID(),
      name: props.name,
      isActive: true,
      storeId: props.storeId,
      products: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  public static restore(props: CategoryModelProps): CategoryModel {
    return new CategoryModel(props);
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get isActive() {
    return this._isActive;
  }
  get products() {
    return this._products;
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
}
