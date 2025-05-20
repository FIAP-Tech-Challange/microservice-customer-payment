import {
  CreateStoreInputDto,
  CreateStoreOutputDto,
} from '../../models/dtos/create-store.dto';

export interface StoresPort {
  create(dto: CreateStoreInputDto): Promise<CreateStoreOutputDto>;
}
