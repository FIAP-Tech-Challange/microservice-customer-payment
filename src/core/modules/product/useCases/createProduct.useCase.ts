import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CreateProductInputDTO } from '../DTOs/createProductInput.dto';
import { Product } from '../entities/product.entity';
import { FindCategoryByIdUseCase } from './findCategoryById.useCase';
import { CategoryGateway } from '../gateways/category.gateway';

export class CreateProductUseCase {
  constructor(
    private categoryGateway: CategoryGateway,
    private findCategoryByIdUseCase: FindCategoryByIdUseCase,
  ) {}

  async execute(dto: CreateProductInputDTO): Promise<CoreResponse<Product>> {
    const category = await this.findCategoryByIdUseCase.execute(
      dto.categoryId,
      dto.storeId,
    );
    if (category.error) return { error: category.error, value: undefined };

    const product = Product.create({
      name: dto.product.name,
      description: dto.product.description,
      price: dto.product.price,
      storeId: dto.storeId,
      prepTime: dto.product.prepTime,
      imageUrl: dto.product.imageUrl,
    });
    if (product.error) return { error: product.error, value: undefined };

    const addProduct = category.value.addProduct(product.value);
    if (addProduct.error) return { error: addProduct.error, value: undefined };

    const saveCategory = await this.categoryGateway.save(category.value);
    if (saveCategory.error) {
      return {
        error: saveCategory.error,
        value: undefined,
      };
    }

    return { error: undefined, value: product.value };
  }
}
