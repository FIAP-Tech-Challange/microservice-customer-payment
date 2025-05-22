import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoresService } from '../../stores.service';
import { StoresPort } from '../../ports/input/stores.port';
import { CreateStoreInputDto } from '../../models/dtos/create-store.dto';
import { StoreGuard } from 'src/modules/auth/guards/auth.guard';
import { SimplifiedStoreDto } from '../../models/dtos/simplified-store.dto';
import { RequestWithStoreId } from 'src/modules/auth/models/dtos/request.dto';

@Controller('stores')
export class StoresController implements StoresPort {
  constructor(private readonly storeService: StoresService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateStoreInputDto) {
    const store = await this.storeService.create(dto);
    return { id: store.id };
  }

  @UseGuards(StoreGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('totems')
  async createTotem(
    @Req() req: RequestWithStoreId,
    @Body('totemName') totemName: string,
  ) {
    const storeId = req.storeId;
    const totem = await this.storeService.createTotem(storeId, totemName);
    return { id: totem.id };
  }

  @UseGuards(StoreGuard)
  @Post('totems/:totemId/inactivate')
  async inactivateTotem(
    @Req() req: RequestWithStoreId,
    @Param('totemId') totemId: string,
  ): Promise<void> {
    const storeId = req.storeId;
    await this.storeService.inactivateTotem(storeId, totemId);
  }

  @UseGuards(StoreGuard)
  @Get()
  async findById(@Req() req: RequestWithStoreId): Promise<SimplifiedStoreDto> {
    const storeId = req.storeId;
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
