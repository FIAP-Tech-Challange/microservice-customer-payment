import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Category } from '../entities/category.entity';
import { CategoryGateway } from '../gateways/category.gateway';

export class FindAllCategoriesByStoreIdUseCase {
  constructor(private categoryGateway: CategoryGateway) {}

  async execute(storeId: string): Promise<CoreResponse<Category[]>> {
    const findCategories =
      await this.categoryGateway.findAllCategoriesByStoreId(storeId);
    if (findCategories.error) {
      return { error: findCategories.error, value: undefined };
    }

    return { error: undefined, value: findCategories.value };
  }
}
