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
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import {
  RequestFromStore,
  RequestFromTotem,
} from 'src/modules/auth/models/dtos/request.dto';
import { StoreMapper } from '../../models/store.mapper';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';

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
    @Req() req: RequestFromStore,
    @Body('totemName') totemName: string,
  ) {
    const storeId = req.storeId;
    const totem = await this.storeService.createTotem(storeId, totemName);
    return { id: totem.id };
  }

  @UseGuards(StoreGuard)
  @Post('totems/:totemId/inactivate')
  async inactivateTotem(
    @Req() req: RequestFromStore,
    @Param('totemId') totemId: string,
  ): Promise<void> {
    const storeId = req.storeId;
    await this.storeService.inactivateTotem(storeId, totemId);
  }

  @UseGuards(StoreGuard)
  @Get()
  async findById(@Req() req: RequestFromStore) {
    const storeId = req.storeId;
    const store = await this.storeService.findById(storeId);
    return StoreMapper.fromDomainToSimplifiedStoreDto(store);
  }

  @UseGuards(StoreOrTotemGuard)
  @Get('totems/ping')
  pingFromTotem(@Req() req: RequestFromTotem) {
    const { totemAccessToken, totemId, storeId } = req;

    return {
      totemAccessToken,
      totemId,
      storeId,
    };
  }
}
