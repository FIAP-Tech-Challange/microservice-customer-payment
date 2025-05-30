import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CategoryModel } from '../models/domain/category.model';
import {
  CATEGORY_REPOSITORY_PORT,
  CategoryRepositoryPort,
} from '../ports/output/category-repository.port';
import { CreateProductDto } from '../models/dto/create-product.dto';
import { ProductModel } from '../models/domain/product.model';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../ports/output/product-repository.port';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY_PORT)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async findAll(storeId: string): Promise<CategoryModel[]> {
    return this.categoryRepository.findAll(storeId);
  }

  async findById(id: string, storeId: string): Promise<CategoryModel | null> {
    const category = await this.categoryRepository.findById(id);

    if (!category || category.storeId !== storeId) {
      return null;
    }

    return category;
  }

  async findByName(
    name: string,
    storeId: string,
  ): Promise<CategoryModel | null> {
    return this.categoryRepository.findByName(name, storeId);
  }

  async create(name: string, storeId: string): Promise<CategoryModel> {
    const duplicated = await this.categoryRepository.findByName(name, storeId);

    if (duplicated) {
      throw new ConflictException('Category already exists');
    }

    let category: CategoryModel;

    try {
      category = CategoryModel.create({
        name,
        storeId: storeId,
      });
    } catch (error) {
      throw new BadRequestException('Invalid category data: ' + error.message);
    }

    await this.categoryRepository.save(category);

    return category;
  }

  async delete(id: string, storeId: string): Promise<void> {
    const category = await this.findById(id, storeId);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    await this.categoryRepository.delete(category);
  }

  async createProduct(
    categoryId: string,
    storeId: string,
    productDto: CreateProductDto,
  ): Promise<ProductModel> {
    const category = await this.findById(categoryId, storeId);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = ProductModel.create({
      name: productDto.name,
      description: productDto.description,
      price: productDto.price,
      store_id: storeId,
      prep_time: productDto.prep_time,
      image_url: productDto.image_url,
    });

    category.addProduct(product);

    await this.categoryRepository.save(category);

    return product;
  }

  async removeProduct(
    categoryId: string,
    storeId: string,
    productId: string,
  ): Promise<void> {
    const category = await this.findById(categoryId, storeId);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    let product: ProductModel;

    try {
      product = category.removeProduct(productId);
    } catch (error) {
      throw new BadRequestException(`Error removing product: ${error.message}`);
    }

    await this.productRepository.delete(product);
    await this.categoryRepository.save(category);
  }
}
