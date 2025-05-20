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
import { StoresService } from '../../stores.service';
import { StoresPort } from '../../ports/input/stores.port';
import { CreateStoreInputDto } from '../../models/dtos/create-store.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { SimplifiedStoreDto } from '../../models/dtos/simplified-store.dto';

@Controller('stores')
export class StoresController implements StoresPort {
  constructor(private readonly storeService: StoresService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateStoreInputDto) {
    const store = await this.storeService.create(dto);
    return { id: store.id };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(':storeId/totems')
  async createTotem(
    @Param('storeId') storeId: string,
    @Body('totemName') totemName: string,
  ) {
    const totem = await this.storeService.createTotem(storeId, totemName);
    return { id: totem.id };
  }

  @UseGuards(AuthGuard)
  @Get(':storeId')
  async findById(
    @Param('storeId') storeId: string,
  ): Promise<SimplifiedStoreDto> {
    const store = await this.storeService.findById(storeId);
    return {
      id: store.id,
      name: store.name,
      fantasyName: store.fantasyName,
      email: store.email,
      phone: store.phone,
      cnpj: store.cnpj,
      isActive: store.isActive,
      totems: store.totems.map((t) => ({
        id: t.id,
        name: t.name,
        tokenAccess: t.tokenAccess,
        isActive: t.isActive,
      })),
    };
  }
}
