import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dtos/create-store.dto';
import { Store } from './entities/store.entity';
import { Public } from '../auth/guards/public.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoresService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateStoreDto): Promise<{ id: string }> {
    const store = await this.storeService.create(dto);
    return { id: store.id };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Store> {
    const store = await this.storeService.findById(id);

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  }
}
