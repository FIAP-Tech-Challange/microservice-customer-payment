import { ProductModel } from 'src/modules/product/models/domain/product.model';
import { ProductRepositoryPort } from 'src/modules/product/ports/output/product-repository.port';

export class InMemoryProductRepository implements ProductRepositoryPort {
  private products: ProductModel[] = [];

  async findAll(): Promise<ProductModel[]> {
    return Promise.resolve(this.products);
  }

  async create(product: ProductModel): Promise<void> {
    this.products.push(product);
    return Promise.resolve();
  }

  async findById(id: string): Promise<ProductModel | null> {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      return Promise.resolve(null);
    }

    return Promise.resolve(product);
  }

  async update(product: ProductModel): Promise<void> {
    const idx = this.products.findIndex((p) => p.id === product.id);
    if (idx !== -1) this.products[idx] = product;
    return Promise.resolve();
  }

  async delete(product: ProductModel): Promise<void> {
    this.products = this.products.filter((p) => p.id !== product.id);
    return Promise.resolve();
  }
}
