import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { CreateStoreInputDto } from '../../models/dtos/create-store.dto';
import { SimplifiedStoreDto } from '../../models/dtos/simplified-store.dto';

export interface StoresPort {
  create(dto: CreateStoreInputDto): Promise<{ id: string }>;
  createTotem(
    req: RequestFromStore,
    totemName: string,
  ): Promise<{ id: string }>;
  inactivateTotem(req: RequestFromStore, totemId: string): Promise<void>;
  findById(req: RequestFromStore): Promise<SimplifiedStoreDto>;
}
