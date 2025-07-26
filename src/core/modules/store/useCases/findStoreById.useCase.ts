import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';

export class FindStoreByIdUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(id: string): Promise<CoreResponse<Store>> {
    const store = await this.storeGateway.findStoreById(id);
    if (store.error) return { error: store.error, value: undefined };

    if (!store.value) {
      return {
        error: new ResourceNotFoundException('Store not found'),
        value: undefined,
      };
    }

    return { error: undefined, value: store.value };
  }
}
