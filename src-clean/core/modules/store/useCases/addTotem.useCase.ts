import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { StoreGateway } from '../gateways/store.gateway';
import { AddTotemInputDTO } from '../DTOs/addTotemInput.dto';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { Totem } from '../entities/totem.entity';

export class AddTotemUseCase {
  constructor(private storeGateway: StoreGateway) {}

  async execute(dto: AddTotemInputDTO): Promise<CoreResponse<Totem>> {
    const { error: gatewayErr, value: store } =
      await this.storeGateway.findStoreById(dto.storeId);
    if (gatewayErr) return { error: gatewayErr, value: undefined };
    if (!store)
      return {
        error: new ResourceNotFoundException('Store not found'),
        value: undefined,
      };

    const totem = Totem.create({ name: dto.totemName });
    if (totem.error) return { error: totem.error, value: undefined };

    const addTotem = store.addTotem(totem.value);
    if (addTotem.error) return { error: addTotem.error, value: undefined };

    const saveStore = await this.storeGateway.saveStore(store);
    if (saveStore.error) return { error: saveStore.error, value: undefined };

    return { error: undefined, value: totem.value };
  }
}
