import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { StoreGateway } from '../gateways/store.gateway';
import { Store } from '../entities/store.entity';

export class FindStoreByTotemAccessTokenUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(accessToken: string): Promise<CoreResponse<Store>> {
    const store =
      await this.storeGateway.findStoreByTotemAccessToken(accessToken);

    if (store.error)
      return {
        error: store.error,
        value: undefined,
      };

    if (!store.value)
      return {
        error: new ResourceNotFoundException('Store not found'),
        value: undefined,
      };

    return { error: undefined, value: store.value };
  }
}
