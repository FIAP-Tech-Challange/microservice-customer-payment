import { StoreDTO } from '../DTOs/store.dto';
import { Store } from '../entities/store.entity';
import { TotemPresenter } from './totem.presenter';

export class StorePresenter {
  static toDto(store: Store): StoreDTO {
    return {
      id: store.id,
      name: store.name,
      cnpj: store.cnpj.toString(),
      phone: store.phone?.toString(),
      fantasyName: store.fantasyName,
      email: store.email.toString(),
      totems: store.totems.map((totem) => TotemPresenter.toDto(totem)),
    };
  }
}
