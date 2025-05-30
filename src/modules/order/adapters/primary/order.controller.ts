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
import { OrderModel } from '../../models/domain/order.model';
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
import { OrderIdDto } from '../../models/dto/order-id.dto';
import { UpdateOrderStatusDto } from '../../models/dto/update-order-status.dto';
import { StoreGuard } from 'src/modules/auth/guards/store.guard';
import { StoreOrTotemGuard } from 'src/modules/auth/guards/store-or-totem.guard';
import {
  RequestFromStore,
  RequestFromTotem,
} from 'src/modules/auth/models/dtos/request.dto';

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
  findById(
    @Param() params: OrderIdDto,
    @Request() req: RequestFromStore,
  ): Promise<OrderModel> {
    return this.orderService.findById(params.id, req.storeId);
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
  updateStatus(
    @Param() params: OrderIdDto,
    @Body() body: UpdateOrderStatusDto,
    @Request() req: RequestFromStore,
  ): Promise<OrderModel> {
    return this.orderService.updateStatus(params.id, body.status, req.storeId);
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
    @Param() params: OrderIdDto,
    @Request() req: RequestFromStore,
  ): Promise<void> {
    return this.orderService.delete(params.id, req.storeId);
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
  ): Promise<OrderModel> {
    return this.orderService.deleteOrderItem(orderItemId, req.storeId);
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
  @Patch(':id/customer')
  async updateCustomerId(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('customerId') customerId: string,
    @Request() req: RequestFromStore,
  ): Promise<OrderModel> {
    return this.orderService.updateCustomerId(id, customerId, req.storeId);
  }
}
