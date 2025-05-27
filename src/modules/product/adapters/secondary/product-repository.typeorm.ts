import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../models/entities/product.entity';
import { ProductRepositoryPort } from '../../ports/output/product-repository.port';
import { ProductModel } from '../../models/domain/product.model';
import { ProductMapper } from '../../models/product.mapper';

@Injectable()
export class ProductRepositoryTypeORM implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findById(id: string) {
    const productEntity = await this.productRepository.findOne({
      where: { id: id },
    });

    return productEntity ? productEntity.toModel() : null;
  }

  async findAll(): Promise<ProductModel[]> {
    const productEntities = await this.productRepository.find();
    return productEntities.map((entity) => entity.toModel());
  }

  async create(product: ProductModel): Promise<void> {
    const productEntity = ProductMapper.toEntity(product);
    await this.productRepository.save(productEntity);
  }

  async update(product: ProductModel): Promise<void> {
    const productEntity = ProductMapper.toEntity(product);
    await this.productRepository.save(productEntity);
  }

  async delete(product: ProductModel): Promise<void> {
    await this.productRepository.delete(product.id);
  }
}
