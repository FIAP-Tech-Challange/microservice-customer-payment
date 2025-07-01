import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

export class FindStoreByEmailUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(email: string): Promise<CoreResponse<Store>> {
    const { error: err, value: store } =
      await this.storeGateway.findStoreByEmail(email);
    if (err) return { error: err, value: undefined };

    if (!store) {
      return {
        error: new ResourceNotFoundException('Store not found'),
        value: undefined,
      };
    }

    return { error: undefined, value: store };
  }
}
