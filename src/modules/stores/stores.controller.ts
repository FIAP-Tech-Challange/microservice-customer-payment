import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateStoreDto } from './dtos/create-store.dto';
import { Store } from './entities/store.entity';
import { StoreService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoreService) {}

  @Get(':id')
  findById(@Param('id') id: string): Promise<Store> {
    return this.storeService.findById(id);
  }

  @Post()
  create(@Body() createStoreDto: CreateStoreDto): Promise<Store> {
    return this.storeService.createStore(createStoreDto);
  }
}
