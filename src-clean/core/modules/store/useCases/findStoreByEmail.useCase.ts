import { Store } from '../entities/store.entity';
import { StoreGateway } from '../gateways/store.gateway';

export class FindStoreByEmailUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(email: string): Promise<Store> {
    const store = await this.storeGateway.findStoreByEmail(email);

    if (!store) {
      throw new Error('Email or password invalid');
    }

    return store;
  }
}
