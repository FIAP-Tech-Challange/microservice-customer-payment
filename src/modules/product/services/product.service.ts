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

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async findAll(): Promise<ProductModel[]> {
    return this.productRepository.findAll();
  }

  async create(
    createProductDto: CreateProductDto,
    storeId: string,
  ): Promise<ProductModel> {
    let product: ProductModel;

    try {
      product = ProductModel.create({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        prep_time: createProductDto.prep_time,
        image_url: createProductDto.image_url,
        store_id: storeId,
      });
    } catch (error) {
      throw new BadRequestException(`Invalid product data: ${error.message}`);
    }

    await this.productRepository.create(product);

    return product;
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);

    await this.productRepository.delete(product);
  }

  async findById(id: string): Promise<ProductModel> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductModel> {
    const product = await this.findById(id);

    product.changeValues({
      description: updateProductDto.description,
      image_url: updateProductDto.image_url,
      is_active: updateProductDto.is_active,
      name: updateProductDto.name,
      prep_time: updateProductDto.prep_time,
      price: updateProductDto.price,
    });

    await this.productRepository.update(product);

    return product;
  }
}
