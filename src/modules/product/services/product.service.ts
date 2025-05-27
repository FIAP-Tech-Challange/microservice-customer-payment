import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepositoryPort } from '../ports/output/product-repository.port';
import { ProductModel } from '../models/domain/product.model';
import { CreateProductDto } from '../models/dto/create-product.dto';
import { UpdateProductDto } from '../models/dto/update-product.dto';
import { PRODUCT_REPOSITORY_PORT } from '../product.tokens';
import { ProductInputPort } from '../ports/input/product.port';

@Injectable()
export class ProductService implements ProductInputPort {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid product ID');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);
  }

  async findById(id: number): Promise<ProductModel> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findAll(): Promise<ProductModel[]> {
    return this.productRepository.findAll();
  }

  async create(createProductDto: CreateProductDto): Promise<ProductModel> {
    if (!createProductDto.name || createProductDto.name.length < 3) {
      throw new BadRequestException('Product name must be at least 3 characters long');
    }

    if (createProductDto.price == null || createProductDto.price <= 0) {
      throw new BadRequestException('Product price must be greater than 0');
    }

    return this.productRepository.create({
      ...createProductDto,
      price: createProductDto.price,
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductModel> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid product ID');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.update(id, {
      ...updateProductDto,
      price: updateProductDto.price,
    });
  }

  async delete(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid product ID');
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);
  }
}