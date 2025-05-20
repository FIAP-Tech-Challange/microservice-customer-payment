import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './models/dtos/create-store.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { StoreModel } from './models/domain/store.model';

@Controller('stores')
export class StoresController {
  constructor(private readonly storeService: StoresService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateStoreDto): Promise<{ id: string }> {
    const store = await this.storeService.create(dto);
    return { id: store.id };
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<StoreModel> {
    const store = await this.storeService.findById(id);

    if (!store) {
      throw new Error('Store not found');
    }

    return store;
  }
}
