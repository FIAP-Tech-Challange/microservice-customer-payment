import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnexpectedError } from 'src-clean/common/exceptions/unexpectedError';
import { DataSourceProxy } from 'src-clean/external/dataSources/dataSource.proxy';
import { createPostgresGeneralDataSource } from 'src-clean/external/dataSources/general/postgres/createPostgresDataSource';
import { FakePaymentDataSource } from 'src-clean/external/dataSources/payment/fake/fakePaymentDataSource';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderCoreController } from 'src-clean/core/modules/order/controllers/order.controller';
import { OrderResponseDto } from 'src/modules/order/models/dto/order-response.dto';

@ApiTags('Order')
@Controller({
  path: 'order',
  version: '1',
})
export class OrderController {
  constructor() {}

  @Post()
  async create(@Body() body: CreateOrderDto): Promise<OrderResponseDto> {
    const dataSource = new DataSourceProxy(
      await createPostgresGeneralDataSource(),
      new FakePaymentDataSource(),
    );

    const { error: err, value: order } = await new OrderCoreController(
      dataSource,
    ).createOrder({
      storeId: body.storeId,
      totemId: body.totemId,
      customerId: body.customerId,
      orderItems: body.orderItems,
    });

    if (err) {
      if (err.code === UnexpectedError.CODE) {
        throw new Error('Ops! Something went wrong');
      }

      throw new BadRequestException(err.message);
    }
    if (!order) {
      throw new BadRequestException('Order not created');
    }
    return order;
  }
}
