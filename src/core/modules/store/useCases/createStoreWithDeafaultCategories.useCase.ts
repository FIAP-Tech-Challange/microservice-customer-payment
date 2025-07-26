import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CreateStoreInputDTO } from '../DTOs/createStoreInput.dto';
import { Store } from '../entities/store.entity';
import { CreateCategoryUseCase } from '../../product/useCases/createCategory.useCase';
import { CreateStoreUseCase } from './createStore.useCase';

export class CreateStoreWithDefaultCategoriesUseCase {
  constructor(
    private createStoreUseCase: CreateStoreUseCase,
    private createCategoryUseCase: CreateCategoryUseCase,
  ) {}

  async execute(dto: CreateStoreInputDTO): Promise<CoreResponse<Store>> {
    const store = await this.createStoreUseCase.execute(dto);

    if (store.error) return { error: store.error, value: undefined };

    await Promise.all([
      this.createCategoryUseCase.execute({
        name: 'Lanche',
        storeId: store.value.id,
      }),
      this.createCategoryUseCase.execute({
        name: 'Acompanhamento',
        storeId: store.value.id,
      }),
      this.createCategoryUseCase.execute({
        name: 'Bebida',
        storeId: store.value.id,
      }),
      this.createCategoryUseCase.execute({
        name: 'Sobremesa',
        storeId: store.value.id,
      }),
    ]);

    return { error: undefined, value: store.value };
  }
}
