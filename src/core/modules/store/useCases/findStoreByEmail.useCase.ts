import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';
import { ResourceNotFoundException } from 'src/common/exceptions/resourceNotFoundException';
import { Email } from 'src/core/common/valueObjects/email.vo';

export class FindStoreByEmailUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(email: string): Promise<CoreResponse<Store>> {
    const emailCreate = Email.create(email);
    if (emailCreate.error) {
      return {
        error: emailCreate.error,
        value: undefined,
      };
    }

    const findStoreByEmail = await this.storeGateway.findStoreByEmail(
      emailCreate.value,
    );
    if (findStoreByEmail.error) {
      return {
        error: findStoreByEmail.error,
        value: undefined,
      };
    }

    if (!findStoreByEmail.value) {
      return {
        error: new ResourceNotFoundException('Store not found'),
        value: undefined,
      };
    }

    return { error: undefined, value: findStoreByEmail.value };
  }
}
