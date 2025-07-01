import { TotemDTO } from './totem.dto';

export interface StoreDTO {
  id: string;
  name: string;
  fantasyName: string;
  email: string;
  totems: TotemDTO[];
}
