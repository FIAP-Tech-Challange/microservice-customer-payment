import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

export class FindStoreByEmailUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(email: string): Promise<CoreResponse<Store>> {
    const [err, store] = await this.storeGateway.findStoreByEmail(email);
    if (err) return [err, undefined];

    if (!store) {
      throw new ResourceNotFoundException('Store not found');
    }

    return [undefined, store];
  }
}
