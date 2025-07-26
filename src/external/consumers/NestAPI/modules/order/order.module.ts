import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';

@Module({
  controllers: [OrderController],
  providers: [],
  exports: [],
})
export class OrderModule {}
