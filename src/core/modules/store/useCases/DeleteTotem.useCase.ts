import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { FindStoreByIdUseCase } from './findStoreById.useCase';
import { StoreGateway } from '../gateways/store.gateway';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';

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

    try {
      await this.storeGateway.removeTotem(totemId);
      return { error: undefined, value: undefined };
    } catch (error) {
      return {
        error: new UnexpectedError(
          `Something went wrong while deleting the totem ${error.message}`,
        ),
        value: undefined,
      };
    }
  }
}
