import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  Request,
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
import { DataSourceProxy } from 'src/external/dataSources/dataSource.proxy';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderCoreController } from 'src/core/modules/order/controllers/order.controller';
import { BusinessException } from '../../../shared/dto/business-exception.dto';
import { OrderRequestParamsDto } from '../dtos/order-request-params.dto';
import { OrderStatusEnum } from 'src/core/modules/order/entities/order.entity';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { OrderPaginationDto } from '../dtos/order-pagination.dto';
import { OrderSortedListDto } from '../dtos/order-sorted-list.dto';
import { StoreOrTotemGuard } from '../../auth/guards/store-or-totem.guard';
import {
  RequestFromStore,
  RequestFromTotem,
} from '../../auth/dtos/request.dto';
import { StoreGuard } from '../../auth/guards/store.guard';

@ApiTags('Order')
@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

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
  @UseGuards(StoreOrTotemGuard)
  @Post()
  async create(
    @Body() body: CreateOrderDto,
    @Request() req: RequestFromTotem,
  ): Promise<OrderResponseDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).createOrder({
      storeId: req.storeId,
      totemId: req.totemId,
      orderItems: body.orderItems,
    });

    if (err || !order) {
      this.logger.error(`Order creation failed: ${err?.message}`);
      throw new BusinessException(`Order not created ${err?.message}`, 400);
    }
    this.logger.log(`Order created successfully: ${order.id}`);
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
  @UseGuards(StoreGuard)
  @Get('all')
  async getAll(
    @Query() params: OrderRequestParamsDto,
    @Request() req: RequestFromStore,
  ): Promise<OrderPaginationDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).getAllOrders(
      params.page ?? 1,
      params.limit ?? 10,
      params.status ?? OrderStatusEnum.PENDING,
      req.storeId,
    );

    if (err) {
      this.logger.error(`Failed to fetch orders: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    this.logger.log(`Fetched ${order.total} orders successfully`);
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
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Get('/sorted-list')
  async getSortedList(
    @Request() req: RequestFromStore,
  ): Promise<OrderSortedListDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).getFilteredAndSortedOrders(req.storeId);

    if (err) {
      this.logger.error(`Failed to fetch sorted orders: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    this.logger.log(`Fetched sorted ${order.total} orders successfully`);
    return order;
  }

  @ApiResponse({
    status: 200,
    description: 'order status successfully updated to in progress',
  })
  @ApiResponse({
    status: 400,
    description: 'Order status has not been updated',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update status order by orderId for in progress' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Patch(':id/prepare')
  async updateStatusForInProgress(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const { error: err } = await new OrderCoreController(
      this.dataSource,
    ).setOrderToInProgress(id, req.storeId);

    if (err) {
      this.logger.error(`Failed to update order status: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    this.logger.log(`Order ${id} updated to status IN_PROGRESS successfully`);
  }

  @ApiResponse({
    status: 200,
    description: 'order status successfully updated to ready',
  })
  @ApiResponse({
    status: 400,
    description: 'Order status has not been updated',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update status order by orderId for ready' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Patch(':id/ready')
  async updateStatusForReady(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const { error: err } = await new OrderCoreController(
      this.dataSource,
    ).setOrderToReady(id, req.storeId);

    if (err) {
      this.logger.error(`Failed to update order status: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    this.logger.log(`Order ${id} updated to status READY successfully`);
  }

  @ApiResponse({
    status: 200,
    description: 'order status successfully updated to finished',
  })
  @ApiResponse({
    status: 400,
    description: 'Order status has not been updated',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update status order by orderId for finished' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Patch(':id/finished')
  async updateStatusForFinished(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const { error: err } = await new OrderCoreController(
      this.dataSource,
    ).setOrderToFinished(id, req.storeId);

    if (err) {
      this.logger.error(`Failed to update order status: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    this.logger.log(`Order ${id} updated to status FINISHED successfully`);
  }

  @ApiResponse({
    status: 200,
    description: 'order status successfully updated to canceled',
  })
  @ApiResponse({
    status: 400,
    description: 'Order status has not been updated',
    type: BusinessException,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update status order by orderId for canceled' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Patch(':id/canceled')
  async updateStatusForCanceled(
    @Param('id') id: string,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    const coreController = new OrderCoreController(this.dataSource);

    const { error: err } = await coreController.setOrderToCanceled(
      id,
      req.storeId,
    );

    if (err) {
      this.logger.error(`Failed to update order status: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    this.logger.log(`Order ${id} updated to status CANCELED successfully`);
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
  @UseGuards(StoreOrTotemGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<OrderResponseDto> {
    if (!id || id.trim() === '') {
      throw new BusinessException('Order ID is required', 400);
    }

    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).findOrderById(id);

    if (err) {
      this.logger.error(`Failed to find order: ${err.message}`);
      throw new BusinessException(err.message, 400);
    }
    if (!order) {
      throw new BusinessException('Order not found', 404);
    }
    this.logger.log(`Order ${id} found successfully`);
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
  @UseGuards(StoreOrTotemGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
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
  @UseGuards(StoreOrTotemGuard)
  @Delete('order-item/:id')
  async deleteOrderItem(
    @Param('id', new ParseUUIDPipe()) orderItemId: string,
  ): Promise<OrderResponseDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).deleteOrderItem(orderItemId);

    if (err || !order) {
      this.logger.error(`Failed to delete order item: ${err?.message}`);
      throw new BusinessException('Order item has not been deleted', 400);
    }
    this.logger.log(`Order item ${orderItemId} deleted successfully`);
    return order;
  }

  @ApiResponse({
    status: 200,
    description: 'Customer ID updated successfully',
    type: OrderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'it is not possible to update the customer id in the order',
    type: BusinessException,
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
  @ApiOperation({ summary: 'Link customer to order' })
  @ApiBearerAuth('access-token')
  @ApiBearerAuth('totem-token')
  @UseGuards(StoreOrTotemGuard)
  @Patch(':id/customer')
  async updateCustomerId(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('customerId') customerId: string,
    @Request() req: RequestFromStore,
  ): Promise<OrderResponseDto> {
    const { error: err, value: order } = await new OrderCoreController(
      this.dataSource,
    ).linkCustomerToOrder(id, customerId, req.storeId);

    if (err) {
      this.logger.error(`Failed to link customer to order: ${err?.message}`);
      throw new BusinessException(
        `it is not possible to update the customer id in the order: ${err?.message}`,
        400,
      );
    }

    if (!order) {
      this.logger.error(`Order with ID ${id} not found`);
      throw new BusinessException(`Order with ID ${id} not found`, 404);
    }

    this.logger.log(`Customer ID updated successfully for order ${id}`);
    return order;
  }
}
