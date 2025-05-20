import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from '../../stores.service';
import { StoresPort } from '../../ports/input/stores.port';
import {
  CreateStoreInputDto,
  CreateStoreOutputDto,
} from '../../models/dtos/create-store.dto';
import { CreateTotemOutputDto } from '../../models/dtos/create-totem.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

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

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':storeId/totems')
  async createTotem(
    @Param('storeId') storeId: string,
    @Body('totemName') totemName: string,
  ): Promise<CreateTotemOutputDto> {
    const totem = await this.storeService.createTotem(storeId, totemName);
    return { id: totem.id };
  }
}
