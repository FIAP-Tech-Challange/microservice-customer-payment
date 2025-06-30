import { StoreDTO } from '../DTOs/store.dto';
import { Store } from '../entities/store.entity';

export class StorePresenter {
  static toDto(store: Store): StoreDTO {
    return {
      id: store.id,
      name: store.name,
      fantasyName: store.fantasyName,
      email: store.email.toString(),
    };
  }
}
