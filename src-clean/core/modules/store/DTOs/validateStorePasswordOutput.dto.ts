import { Store } from '../entities/store.entity';

export interface ValidateStorePasswordOutputDTO {
  isValid: boolean;
  store: Store;
}
