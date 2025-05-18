import { Inject, Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../ports/output/product-repository.port';
import { ProductModel } from '../models/product.model';
import { CreateProductDto } from '../models/dto/create-product.dto';
import { UpdateProductDto } from '../models/dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort
  ) {}

  async findAll(): Promise<ProductModel[]> {
    return this.productRepository.findAll();
  }

  async findOne(id: number): Promise<ProductModel> {
    return this.productRepository.findById(id);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductModel> {
    return this.productRepository.create({
      ...createProductDto,
      price: createProductDto.price.toString(),
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductModel> {
    return this.productRepository.update(id, {
      ...updateProductDto,
      price: updateProductDto.price?.toString(),
    });
  }

  async remove(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }
}