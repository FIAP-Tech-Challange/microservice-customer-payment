import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { AddTotemInputDTO } from '../DTOs/addTotemInput.dto';
import { Totem } from '../entities/totem.entity';
import { FindStoreByIdUseCase } from './findStoreById.useCase';
import { StoreGateway } from '../gateways/store.gateway';

export class AddTotemUseCase {
  constructor(
    private storeGateway: StoreGateway,
    private findStoreByIdUseCase: FindStoreByIdUseCase,
  ) {}

  async execute(dto: AddTotemInputDTO): Promise<CoreResponse<Totem>> {
    const store = await this.findStoreByIdUseCase.execute(dto.storeId);
    if (store.error) return { error: store.error, value: undefined };

    const totem = Totem.create({ name: dto.totemName });
    if (totem.error) return { error: totem.error, value: undefined };

    const addTotem = store.value.addTotem(totem.value);
    if (addTotem.error) return { error: addTotem.error, value: undefined };

    const saveStore = await this.storeGateway.saveStore(store.value);
    if (saveStore.error) return { error: saveStore.error, value: undefined };

    return { error: undefined, value: totem.value };
  }
}
