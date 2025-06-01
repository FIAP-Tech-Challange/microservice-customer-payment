import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StoresPort } from '../../ports/input/stores.port';
import { CreateStoreInputDto } from '../../models/dtos/create-store.dto';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { RequestFromStore } from 'src/modules/auth/models/dtos/request.dto';
import { StoreMapper } from '../../models/store.mapper';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { StoreIdDto } from '../../models/dtos/store-id.dto';
import { BusinessException } from 'src/shared/dto/business-exception.dto';
import { ApiKeyGuard } from 'src/modules/auth/guards/api-key.guard';
import { ResponseIdUuidDto } from 'src/shared/dto/response-id-uuid.dto';
import { ResponseStoreDto } from '../../models/dtos/response-store.dto';
import { StoresService } from '../../services/stores.service';

@ApiTags('Store')
@Controller({
  path: 'stores',
  version: '1',
})
export class StoresController implements StoresPort {
  constructor(private readonly storeService: StoresService) {}

  @ApiResponse({
    status: 201,
    description: 'Store created successfully',
    type: StoreIdDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Store has not been created, already exists',
    type: BusinessException,
  })
  @ApiResponse({
    status: 400,
    description: 'Store has not been created',
    type: BusinessException,
  })
  @ApiBody({
    description: 'Store data',
    type: CreateStoreInputDto,
  })
  @ApiOperation({ summary: 'Register your store' })
  @ApiSecurity('api-key')
  @UseGuards(ApiKeyGuard)
  @Post()
  async create(@Body() dto: CreateStoreInputDto): Promise<StoreIdDto> {
    try {
      const store = await this.storeService.create(dto);
      return { id: store?.id };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiResponse({
    status: 201,
    description: 'Totem created successfully',
    type: ResponseIdUuidDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Totem has not been created, already exists',
    type: BusinessException,
  })
  @ApiResponse({
    status: 400,
    description: 'Totem has not been created',
    type: BusinessException,
  })
  @ApiBody({
    description: 'Totem data',
    schema: {
      type: 'object',
      properties: {
        totemName: {
          type: 'string',
          example: 'Totem 1',
        },
      },
      required: ['totemName'],
    },
  })
  @ApiOperation({ summary: 'Register the totem' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Post('totems')
  async createTotem(
    @Req() req: RequestFromStore,
    @Body('totemName') totemName: string,
  ) {
    const storeId = req.storeId;
    const totem = await this.storeService.createTotem(storeId, totemName);
    return { id: totem.id };
  }

  @ApiResponse({
    status: 200,
    description: 'Totem deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Totem has not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'totemId',
    type: String,
    description: 'ID totem',
    example: '44226bf5-0187-4d7b-b649-e460fda43b01',
    required: true,
  })
  @ApiOperation({ summary: 'Delete the totem' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Delete('totems/:totemId')
  async deleteTotem(
    @Req() req: RequestFromStore,
    @Param('totemId') totemId: string,
  ): Promise<void> {
    const storeId = req.storeId;
    await this.storeService.deleteTotem(storeId, totemId);
  }

  @ApiResponse({
    status: 200,
    description: 'Store found successfully',
    type: ResponseStoreDto,
  })
  @ApiOperation({
    summary: 'Find Store',
    description:
      'Retrieves the store based on the storeId contained in the accessToken (JWT).',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get()
  async findById(@Req() req: RequestFromStore) {
    const storeId = req.storeId;
    const store = await this.storeService.findById(storeId);
    return StoreMapper.fromDomainToSimplifiedStoreDto(store);
  }
}
