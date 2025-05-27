interface ProductProps {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  description: string | undefined;
  prep_time: number;
  image_url: string | undefined;
  created_at: Date;
  updated_at: Date;
}

export class ProductModel {
  private _id: string;
  private _name: string;
  private _price: number;
  private _is_active: boolean;
  private _description: string | undefined;
  private _prep_time: number;
  private _image_url: string | undefined;
  private _created_at: Date;
  private _updated_at: Date;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._price = props.price;
    this._is_active = props.is_active;
    this._description = props.description;
    this._prep_time = props.prep_time;
    this._image_url = props.image_url;
    this._created_at = props.created_at;
    this._updated_at = props.updated_at;
    this.validate();
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get price(): number {
    return this._price;
  }
  get is_active(): boolean {
    return this._is_active;
  }
  get description(): string | undefined {
    return this._description;
  }
  get prep_time(): number {
    return this._prep_time;
  }
  get image_url(): string | undefined {
    return this._image_url;
  }
  get created_at(): Date {
    return this._created_at;
  }
  get updated_at(): Date {
    return this._updated_at;
  }

  changeValues(props: Omit<ProductProps, 'id' | 'created_at' | 'updated_at'>) {
    this._name = props.name;
    this._price = props.price;
    this._is_active = props.is_active;
    this._description = props.description;
    this._prep_time = props.prep_time;
    this._image_url = props.image_url;
    this._updated_at = new Date();
    this.validate();
  }

  private validate() {
    if (!this._id) {
      throw new Error('ID is required');
    }
    if (this._name.length < 3) {
      throw new Error('Name is too short, must be at least 3 characters');
    }
    if (this._name.length > 255) {
      throw new Error('Name must be less than 255 characters');
    }
    if (this._description && this._description.length > 500) {
      throw new Error('Description must be less than 500 characters');
    }
    if (this._price <= 0) {
      throw new Error('Price must be a positive number');
    }
    if (this._is_active !== !!this._is_active) {
      throw new Error('is_active must be a boolean');
    }
    if (this._prep_time <= 0) {
      throw new Error('Preparation time must be a positive number');
    }
  }

  static create(props: {
    prep_time: number;
    price: number;
    name: string;
    description?: string;
    image_url?: string;
  }): ProductModel {
    return new ProductModel({
      id: crypto.randomUUID(),
      name: props.name,
      description: props.description,
      image_url: props.image_url,
      price: props.price,
      prep_time: props.prep_time,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  static fromProps(props: ProductProps): ProductModel {
    return new ProductModel(props);
  }
}
