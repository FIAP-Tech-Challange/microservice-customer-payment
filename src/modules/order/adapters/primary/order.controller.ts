import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderInputPort } from '../../ports/input/order.port';
import { OrderStatusEnum } from '../../models/enum/order-status.enum';
import {
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../../services/order.service';
import { CreateOrderDto } from '../../models/dto/create-order.dto';
import { OrderRequestParamsDto } from '../../models/dto/order-request-params.dto';
import { OrderResponseDto } from '../../models/dto/order-response.dto';
import { OrderPaginationDto } from '../../models/dto/order-pagination.dto';
import { statusOptionsMessage } from '../../util/status-order.util';
import { UpdateOrderStatusDto } from '../../models/dto/update-order-status.dto';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';
import {
  RequestFromStore,
  RequestFromTotem,
} from 'src/modules/auth/models/dtos/request.dto';
import { OrderMapper } from '../../models/mapper/order.mapper';

@ApiTags('Order')
@Controller({
  path: 'order',
  version: '1',
})
export class OrderController implements OrderInputPort {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Order has not been created',
    type: BadRequestException,
  })
  @ApiBody({
    description: 'Order data',
    type: CreateOrderDto,
  })
  @UseGuards(StoreOrTotemGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestFromTotem,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.create(
      createOrderDto,
      req.storeId,
      req.totemId,
    );

    return OrderMapper.toResponseDto(order);
  }

  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: OrderPaginationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orders not found',
    type: NotFoundException,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of orders per page',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter orders by status',
    type: String,
  })
  @UseGuards(StoreGuard)
  @Get('all')
  async getAll(
    @Query() params: OrderRequestParamsDto,
    @Request() req: RequestFromStore,
  ): Promise<OrderPaginationDto> {
    const paginatedData = await this.orderService.getAll(params, req.storeId);

    return {
      data: paginatedData.data.map((order) => OrderMapper.toResponseDto(order)),
      hasNextPage: paginatedData.hasNextPage,
      hasPreviousPage: paginatedData.hasPreviousPage,
      limit: paginatedData.limit,
      page: paginatedData.page,
      total: paginatedData.total,
      totalPages: paginatedData.totalPages,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Order found successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: String,
  })
  @UseGuards(StoreGuard)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.findById(id, req.storeId);

    return OrderMapper.toResponseDto(order);
  }

  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Order status has not been updated',
    type: BadRequestException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'New status for the order',
    type: String,
    enum: OrderStatusEnum,
    examples: {
      status: {
        value: OrderStatusEnum.READY,
        description: 'Order status options: ' + statusOptionsMessage,
      },
    },
  })
  @UseGuards(StoreGuard)
  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
    @Request() req: RequestFromStore,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.updateStatus(
      id,
      body.status,
      req.storeId,
    );

    return OrderMapper.toResponseDto(order);
  }

  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @UseGuards(StoreGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    return this.orderService.delete(id, req.storeId);
  }

  @ApiResponse({
    status: 200,
    description: 'Order item deleted successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Order item has not been deleted',
    type: BadRequestException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @UseGuards(StoreGuard)
  @Delete('order-item/:id')
  async deleteOrderItem(
    @Param('id', new ParseUUIDPipe()) orderItemId: string,
    @Request() req: RequestFromStore,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.deleteOrderItem(
      orderItemId,
      req.storeId,
    );

    return OrderMapper.toResponseDto(order);
  }

  @ApiResponse({
    status: 200,
    description: 'Customer ID updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot update customer ID due to order status',
    type: BadRequestException,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: NotFoundException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @UseGuards(StoreGuard)
  @Patch(':id/customer')
  async updateCustomerId(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('customerId') customerId: string,
    @Request() req: RequestFromStore,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.updateCustomerId(
      id,
      customerId,
      req.storeId,
    );

    return OrderMapper.toResponseDto(order);
  }
}
