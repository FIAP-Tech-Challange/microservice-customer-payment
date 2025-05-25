import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_REPOSITORY_PORT } from './order.tokens';
import { OrderController } from './adapters/primary/order.controller';
import { OrderEntity } from './models/entities/order.entity';
import { OrderItemEntity } from './models/entities/order-item.entity';
import { OrderService } from './services/order.service';
import { OrderRepositoryAdapter } from './adapters/secondary/order-repository.adapter';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: OrderRepositoryAdapter,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
