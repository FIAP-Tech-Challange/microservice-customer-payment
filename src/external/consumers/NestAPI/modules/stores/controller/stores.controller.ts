import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { StoreIdDto } from '.././dtos/store-id.dto';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { CreateStoreInputDto } from '.././dtos/create-store.dto';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { StoreCoreController } from 'src/core/modules/store/controllers/store.controller';
import { ResponseIdUuidDto } from '../../../shared/dto/response-id-uuid.dto';
import { StoreGuard } from '../../auth/guards/store.guard';
import { RequestFromStore } from '../../auth/dtos/request.dto';
import { ResponseStoreDto } from '.././dtos/response-store.dto';
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';

@ApiTags('Store')
@Controller({
  path: 'stores',
  version: '1',
})
export class StoresController {
  private readonly logger = new Logger(StoresController.name);
  constructor(private dataSourceProxy: DataSourceProxy) {}

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
      const coreController = new StoreCoreController(this.dataSourceProxy);
      const createStore = await coreController.createStore({
        cnpj: dto.cnpj,
        name: dto.name,
        fantasyName: dto.fantasy_name,
        email: dto.email,
        phone: dto.phone,
        plainPassword: dto.password,
      });

      if (createStore.error) {
        this.logger.error(`Error creating store: ${createStore.error.message}`);
        throw new BadRequestException(createStore.error.message);
      }
      this.logger.log(`Store created successfully: ${createStore.value.id}`);
      return { id: createStore.value.id };
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
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

    const coreController = new StoreCoreController(this.dataSourceProxy);
    const createTotem = await coreController.addTotemToStore({
      storeId,
      totemName,
    });

    if (createTotem.error) {
      this.logger.error(`Error creating totem: ${createTotem.error.message}`);
      throw new BadRequestException(createTotem.error.message);
    }
    this.logger.log(`Totem created successfully: ${createTotem.value.id}`);
    return { id: createTotem.value.id };
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
    const coreController = new StoreCoreController(this.dataSourceProxy);
    const deleteTotem = await coreController.deleteTotemFromStore(
      storeId,
      totemId,
    );

    if (deleteTotem.error) {
      this.logger.error(`Error deleting totem: ${deleteTotem.error.message}`);
      throw new BadRequestException(deleteTotem.error.message);
    }
    this.logger.log(`Totem deleted successfully: ${totemId}`);
    return;
  }

  @ApiResponse({
    status: 200,
    description: 'Store found successfully',
    type: ResponseStoreDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Store not found successfully',
    type: BusinessException,
  })
  @ApiOperation({
    summary: 'Find Store',
    description:
      'Retrieves the store based on the storeId contained in the accessToken (JWT).',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get()
  async findById(@Req() req: RequestFromStore): Promise<ResponseStoreDto> {
    const storeId = req.storeId;
    const coreController = new StoreCoreController(this.dataSourceProxy);
    const findStore = await coreController.findStoreById(storeId);

    if (findStore.error) {
      this.logger.error(`Error finding store: ${findStore.error.message}`);
      throw new BusinessException(findStore.error.message, 400);
    }
    this.logger.log(`Store found successfully: ${findStore.value.id}`);
    return {
      id: findStore.value.id,
      name: findStore.value.name,
      cnpj: findStore.value.cnpj,
      phone: findStore.value.phone ?? undefined,
      fantasyName: findStore.value.fantasyName,
      email: findStore.value.email,
      totems: findStore.value.totems.map((totem) => ({
        id: totem.id,
        name: totem.name,
        tokenAccess: totem.tokenAccess,
      })),
    };
  }
}
