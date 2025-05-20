import {
  CreateStoreInputDto,
  CreateStoreOutputDto,
} from '../../models/dtos/create-store.dto';
import { CreateTotemOutputDto } from '../../models/dtos/create-totem.dto';

export interface StoresPort {
  create(dto: CreateStoreInputDto): Promise<CreateStoreOutputDto>;
  createTotem(
    storeId: string,
    totemName: string,
  ): Promise<CreateTotemOutputDto>;
}
