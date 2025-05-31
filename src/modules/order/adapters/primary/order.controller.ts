import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderInputPort } from '../../ports/input/order.port';
import { OrderModel } from '../../models/domain/order.model';
import { OrderStatusEnum } from '../../models/enum/order-status.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
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
import { OrderIdDto } from '../../models/dto/order-id.dto';
import { UpdateOrderStatusDto } from '../../models/dto/update-order-status.dto';
import { RequestFromStoreOrTotem } from 'src/modules/auth/models/dtos/request.dto';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { BusinessException } from 'src/shared/dto/business-exception.dto';

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
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: RequestFromStoreOrTotem,
  ): Promise<OrderModel> {
    return this.orderService.create(createOrderDto, req.storeId, req.totemId);
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
    @Req() req: RequestFromStoreOrTotem,
  ): Promise<OrderPaginationDto> {
    return this.orderService.getAll(params, req.storeId);
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
  findById(@Param() params: OrderIdDto): Promise<OrderModel> {
    return this.orderService.findById(params.id);
  }

  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: OrderResponseDto,
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
  @ApiBody({
    description: `New status for the order, ${statusOptionsMessage}`,
    type: String,
    enum: OrderStatusEnum,
    examples: {
      pending: {
        value: OrderStatusEnum.READY,
      },
      receivid: {
        value: OrderStatusEnum.RECEIVED,
      },
    },
  })
  @ApiOperation({ summary: 'Update order by orderId' })
  @ApiBearerAuth('access-token')
  @UseGuards(StoreGuard)
  @Patch('status/:id')
  updateStatus(
    @Param() params: OrderIdDto,
    @Body() body: UpdateOrderStatusDto,
  ): Promise<OrderModel> {
    return this.orderService.updateStatus(params.id, body.status);
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
  delete(@Param() params: OrderIdDto): Promise<void> {
    return this.orderService.delete(params.id);
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
    @Param('id', new ParseUUIDPipe())
    orderItemId: string,
  ): Promise<OrderModel | void> {
    return this.orderService.deleteOrderItem(orderItemId);
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
  ): Promise<OrderModel> {
    return this.orderService.updateCustomerId(id, customerId);
  }
}
