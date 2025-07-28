import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { FindStoreByIdUseCase } from './findStoreById.useCase';
import { StoreGateway } from '../gateways/store.gateway';

export class DeleteTotemUseCase {
  constructor(
    private storeGateway: StoreGateway,
    private findStoreByIdUseCase: FindStoreByIdUseCase,
  ) {}

  async execute(storeId: string, totemId: string): Promise<CoreResponse<void>> {
    const store = await this.findStoreByIdUseCase.execute(storeId);
    if (store.error) return { error: store.error, value: undefined };

    const removeTotem = store.value.removeTotem(totemId);
    if (removeTotem.error)
      return { error: removeTotem.error, value: undefined };

    await this.storeGateway.saveStore(store.value);
    return { error: undefined, value: undefined };
  }
}
