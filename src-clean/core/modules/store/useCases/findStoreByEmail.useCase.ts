import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';

export class FindStoreByEmailUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(email: string): Promise<CoreResponse<Store>> {
    const { error: emailErr, value: emailValue } = Email.create(email);
    if (emailErr) return { error: emailErr, value: undefined };

    const { error: err, value: store } =
      await this.storeGateway.findStoreByEmail(emailValue);
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
