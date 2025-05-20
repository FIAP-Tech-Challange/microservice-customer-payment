import { CreateStoreInputDto } from '../../models/dtos/create-store.dto';
import { SimplifiedStoreDto } from '../../models/dtos/simplified-store.dto';

export interface StoresPort {
  create(dto: CreateStoreInputDto): Promise<{ id: string }>;
  createTotem(storeId: string, totemName: string): Promise<{ id: string }>;
  findById(storeId: string): Promise<SimplifiedStoreDto>;
}
