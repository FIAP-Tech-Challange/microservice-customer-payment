import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepositoryPort } from '../../ports/output/product-repository.port';
import { NotFoundException } from '@nestjs/common';
import { ProductEntity } from '../../models/entities/product.entity';
import { ProductModel } from '../../models/product.model';

@Injectable()
export class ProductRepositoryAdapter implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductModel[]> {
    const products = await this.productRepository.find();
    return products.map(product => product.toModel());
  }

  async findById(id: number): Promise<ProductModel> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product.toModel();
  }

  async create(productData: Partial<ProductModel>): Promise<ProductModel> {
    const product = new ProductEntity();
    product.name = productData.name!;
    product.price = productData.price!;
    product.status = productData.status || '';
    product.description = productData.description || '';
    product.prep_time = productData.prep_time!;
    product.image_url = productData.image_url || '';
    //product.category_id = productData.category_id!;
    //product.store_id = productData.store_id!;

    const savedProduct = await this.productRepository.save(product);
    return savedProduct.toModel();
  }

  async update(id: number, productData: Partial<ProductModel>): Promise<ProductModel> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    // Atualiza os campos da entidade com os dados do DTO
    if (productData.name) product.name = productData.name;
    if (productData.price) product.price = productData.price;
    if (productData.status !== undefined) product.status = productData.status;
    if (productData.description !== undefined) product.description = productData.description;
    if (productData.prep_time !== undefined) product.prep_time = productData.prep_time;
    if (productData.image_url !== undefined) product.image_url = productData.image_url;
    //if (productData.category_id !== undefined) product.category_id = productData.category_id;
    //if (productData.store_id !== undefined) product.store_id = productData.store_id;

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct.toModel();
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}