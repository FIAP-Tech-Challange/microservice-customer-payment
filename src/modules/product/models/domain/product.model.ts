interface ProductProps {
  id: string;
  name: string;
  price: number;
  status: string;
  description: string;
  prep_time: number;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductModel {
  id: string;
  name: string;
  price: number;
  status: string;
  description: string;
  prep_time: number;
  image_url: string;
  created_at: Date;
  updated_at: Date;

  private constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name;
    this.price = props.price;
    this.status = props.status;
    this.description = props.description;
    this.prep_time = props.prep_time;
    this.image_url = props.image_url;
    this.created_at = props.createdAt;
    this.updated_at = props.updatedAt;
  }

  private validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.name) {
      throw new Error('Name is required');
    }
    if (this.price == null || this.price < 0) {
      throw new Error('Price must be a positive number');
    }
    if (!this.status) {
      throw new Error('Status is required');
    }
    if (this.prep_time == null || this.prep_time < 0) {
      throw new Error('Preparation time must be a positive number');
    }
  }

  static create(
    props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): ProductModel {
    const product = new ProductModel({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    product.validate();
    return product;
  }

  static fromProps(props: ProductProps): ProductModel {
    const model = new ProductModel(props);
    model.validate();
    return model;
  }
}