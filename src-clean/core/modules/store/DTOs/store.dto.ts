import { TotemDTO } from './totem.dto';

export interface StoreDTO {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  fantasyName: string;
  email: string;
  totems: TotemDTO[];
}
