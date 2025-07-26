import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CreateCategoryInputDTO } from '../DTOs/createCategoryInput.dto';
import { Category } from '../entities/category.entity';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { CategoryGateway } from '../gateways/category.gateway';
import { FindStoreByIdUseCase } from '../../store/useCases/findStoreById.useCase';

export class CreateCategoryUseCase {
  constructor(
    private categoryGateway: CategoryGateway,
    private findStoreByIdUseCase: FindStoreByIdUseCase,
  ) {}

  async execute(dto: CreateCategoryInputDTO): Promise<CoreResponse<Category>> {
    const store = await this.findStoreByIdUseCase.execute(dto.storeId);
    if (store.error) return { error: store.error, value: undefined };

    const category = Category.create({
      name: dto.name,
      storeId: dto.storeId,
    });
    if (category.error) return { error: category.error, value: undefined };

    const conflictingCategory = await this.categoryGateway.findCategoryByName(
      dto.name,
      dto.storeId,
    );
    if (conflictingCategory.error) {
      return {
        error: conflictingCategory.error,
        value: undefined,
      };
    }
    if (conflictingCategory.value) {
      return {
        error: new ResourceConflictException(
          'Category with this name already exists in the store',
        ),
        value: undefined,
      };
    }

    const savedProcess = await this.categoryGateway.save(category.value);
    if (savedProcess.error) {
      return {
        error: savedProcess.error,
        value: undefined,
      };
    }

    return { error: undefined, value: category.value };
  }
}
