import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../models/entities/product.entity';
import { ProductRepositoryPort } from '../../ports/output/product-repository.port';
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

    return productEntity ? ProductMapper.toModel(productEntity) : null;
  }
}
