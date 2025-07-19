import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { StoreGateway } from '../gateways/store.gateway';
import { Store } from '../entities/store.entity';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';

export class FindByTotemAccessTokenUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(token: string): Promise<CoreResponse<Store | null>> {
    const findStoreByTotemAccessToken =
      await this.storeGateway.findStoreByTotemAccessToken(token);
    if (findStoreByTotemAccessToken.error) {
      return {
        error: findStoreByTotemAccessToken.error,
        value: undefined,
      };
    }

    if (!findStoreByTotemAccessToken.value) {
      return {
        error: new ResourceNotFoundException('Store and Totem not found'),
        value: undefined,
      };
    }

    return { error: undefined, value: findStoreByTotemAccessToken.value };
  }
}
