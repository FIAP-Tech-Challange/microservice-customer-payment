import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { StoreService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoreService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(dto: CreateStoreDto): Promise<{ id: string }> {
    const store = await this.storeService.create(dto);
    return { id: store.id };
  }
}
