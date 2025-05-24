import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../models/entities/product.entity';
import { ProductRepositoryPort } from '../../ports/output/product-repository.port';
import { ProductModel } from '../../models/domain/product.model';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductModel[]> {
    const products = await this.productRepository.find();
    return products.map(product => product.toModel());
  }
  
  update(id: number, product: Partial<ProductModel>): Promise<ProductModel> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: number): Promise<ProductModel> {
    const product = await this.productRepository.findOne({
      where: { id: id.toString() },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return product.toModel();
  }

  async create(productData: Partial<ProductModel>): Promise<ProductModel> {
    const productModel = ProductModel.create({
      name: productData.name!,
      price: productData.price!,
      status: productData.status || 'inactive',
      description: productData.description || '',
      prep_time: productData.prep_time!,
      image_url: productData.image_url || '',
    });

    const product = new ProductEntity();
    product.id = productModel.id.toString();
    product.name = productModel.name;
    product.price = productModel.price.toString();
    product.status = productModel.status;
    product.description = productModel.description;
    product.prep_time = productModel.prep_time;
    product.image_url = productModel.image_url;

    const savedProduct = await this.productRepository.save(product);
    return savedProduct.toModel();
  }
}