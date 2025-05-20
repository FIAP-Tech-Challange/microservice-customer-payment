import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { StoresService } from '../../stores.service';
import { StoresPort } from '../../ports/input/stores.port';
import {
  CreateStoreInputDto,
  CreateStoreOutputDto,
} from '../../models/dtos/create-store.dto';

@Controller('stores')
export class StoresController implements StoresPort {
  constructor(private readonly storeService: StoresService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() dto: CreateStoreInputDto,
  ): Promise<CreateStoreOutputDto> {
    const store = await this.storeService.create(dto);
    return { id: store.id };
  }
}
