import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CreateCategoryInputDTO } from '../DTOs/createCategoryInput.dto';
import { Category } from '../entities/category.entity';
import { ResourceConflictException } from 'src-clean/common/exceptions/resourceConflictException';
import { CategoryGateway } from '../gateways/category.gateway';

export class CreateCategoryUseCase {
  constructor(private categoryGateway: CategoryGateway) {}

  async execute(dto: CreateCategoryInputDTO): Promise<CoreResponse<Category>> {
    const { error: createErr, value: category } = Category.create({
        name: dto.name,
        storeId: dto.store_id,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: []
    });
    if (createErr) return { error: createErr, value: undefined };

    const { error: findErr, value: existingCategory } =
      await this.categoryGateway.findCategoryByNameAndStoreId(
        dto.name,
        dto.store_id,
      );
    if (findErr) return { error: findErr, value: undefined };
    if (existingCategory) {
      return {
        error: new ResourceConflictException(
          'Category with this name already exists in the store',
        ),
        value: undefined,
      };
    }

    const { error: saveErr, value: savedCategory } =
      await this.categoryGateway.save(category);
    if (saveErr) return { error: saveErr, value: undefined };

    return { error: undefined, value: savedCategory };
  }
}