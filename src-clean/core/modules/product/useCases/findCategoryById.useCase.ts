import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Category } from '../entities/category.entity';
import { CategoryGateway } from '../gateways/category.gateway';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

export class FindCategoryByIdUseCase {
  constructor(private categoryGateway: CategoryGateway) {}

  async execute(id: string): Promise<CoreResponse<Category>> {
    const category = await this.categoryGateway.findCategoryById(id);

    if (category.error) return { error: category.error, value: undefined };

    if (!category.value) {
      return {
        error: new ResourceNotFoundException('Category not found'),
        value: undefined,
      };
    }

    return { error: undefined, value: category.value };
  }
}
