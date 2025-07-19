import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderCoreController } from 'src-clean/core/modules/order/controllers/order.controller';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { OrderRequestParamsDto } from '../dtos/order-request-params.dto';
import { OrderStatusEnum } from 'src-clean/core/modules/order/entities/order.entity';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { OrderPaginationDto } from '../dtos/order-pagination.dto';
import { OrderSortedListDto } from '../dtos/order-sorted-list.dto';

@ApiTags('Order')
@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  constructor(private readonly dataSource: DataSourceProxy) {}

  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Order has not been created',
    type: BusinessException,
  })
  @ApiBody({
    description: 'Order data',
    type: CreateOrderDto,
  })
  @ApiOperation({ summary: 'Register your order' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  //@UseGuards(StoreOrTotemGuard)
  @Post()
  async create(@Body() body: CreateOrderDto): Promise<OrderResponseDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).createOrder({
      storeId: body.storeId,
      totemId: body.totemId,
      customerId: body.customerId,
      orderItems: body.orderItems,
    });

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error(`Ops! Something went wrong.. ${err.message}`);
      }

      throw new BadRequestException(err.message);
    }
    if (!order) {
      throw new BadRequestException('Order not created');
    }
    return order;
  }

  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: OrderPaginationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orders not found',
    type: BusinessException,
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
  @ApiOperation({ summary: 'List all orders' })
  @ApiBearerAuth('access-token')
  //@UseGuards(StoreGuard)
  @Get('all')
  async getAll(
    @Query() params: OrderRequestParamsDto,
    //@Request() req: RequestFromStore,
  ): Promise<OrderPaginationDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).getAllOrders(
      params.page ?? 1,
      params.limit ?? 10,
      params.status ?? OrderStatusEnum.PENDING,
      params.storeId! /*pegar do guard*/,
    );

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error(`Ops! Something went wrong.. ${err.message}`);
      }

      throw new BusinessException(err.message, 400);
    }
    if (!order) {
      throw new BusinessException('Order not found', 404);
    }
    return order;
  }

  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: OrderSortedListDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orders not found',
    type: BusinessException,
  })
  @ApiOperation({ summary: 'List sorted by status and creation date' })
  @Get('/sorted-list')
  async getSortedList(
    @Query('storeId') storeId: string,
    //@Request() req: RequestFromStore,
  ): Promise<OrderSortedListDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).getFilteredAndSortedOrders(storeId);

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error(`Ops! Something went wrong.. ${err.message}`);
      }

      throw new BusinessException(err.message, 400);
    }
    return order;
  }

  @ApiResponse({
    status: 200,
    description: 'Order found successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Order ID',
    type: String,
  })
  @ApiOperation({ summary: 'Find Order by orderId' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  //@UseGuards(StoreOrTotemGuard)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    /*@Request() req: RequestFromStore,*/
  ): Promise<OrderResponseDto> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('Order ID is required');
    }

    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).findOrderById(id);

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error(`Ops! Something went wrong.. ${err.message}`);
      }

      throw new BadRequestException(err.message);
    }
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Delete order by orderId' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  //@UseGuards(StoreOrTotemGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    /*@Request() req: RequestFromStore,*/
  ): Promise<void> {
    const { error: err } = await new OrderCoreController(
      this.dataSource,
    ).deleteOrder(id);

    if (err) {
      throw new BusinessException(err.message, 404);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Order item deleted successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Order item has not been deleted',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order Item ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Delete order item by orderItemId' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  //@UseGuards(StoreOrTotemGuard)
  @Delete('order-item/:id')
  async deleteOrderItem(
    @Param('id', new ParseUUIDPipe()) orderItemId: string,
    /*@Request() req: RequestFromStore,*/
  ): Promise<OrderResponseDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).deleteOrderItem(orderItemId);

    if (err || !order) {
      throw new BusinessException('Order item has not been deleted', 404);
    }

    return order;
  }
}
