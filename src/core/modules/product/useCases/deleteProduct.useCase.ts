import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { FindCategoryByIdUseCase } from './findCategoryById.useCase';
import { CategoryGateway } from '../gateways/category.gateway';

export class DeleteProductUseCase {
  constructor(
    private categoryGateway: CategoryGateway,
    private findCategoryByIdUseCase: FindCategoryByIdUseCase,
  ) {}

  async execute(
    productId: string,
    categoryId: string,
    storeId: string,
  ): Promise<CoreResponse<void>> {
    const category = await this.findCategoryByIdUseCase.execute(
      categoryId,
      storeId,
    );
    if (category.error) return { error: category.error, value: undefined };
    const removeProduct = category.value.removeProduct(productId);

    if (removeProduct.error) {
      return {
        error: removeProduct.error,
        value: undefined,
      };
    }

    const saveCategory = await this.categoryGateway.save(category.value);
    if (saveCategory.error) {
      return {
        error: saveCategory.error,
        value: undefined,
      };
    }

    return { error: undefined, value: undefined };
  }
}
