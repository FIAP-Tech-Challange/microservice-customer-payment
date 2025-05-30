import { TypeOrmModule } from '@nestjs/typeorm';
import { ORDER_REPOSITORY_PORT } from './order.tokens';
import { OrderController } from './adapters/primary/order.controller';
import { OrderEntity } from './models/entities/order.entity';
import { OrderItemEntity } from './models/entities/order-item.entity';
import { OrderService } from './services/order.service';
import { OrderRepositoryTypeORM } from './adapters/secondary/order.repository.typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { JwtModule } from '@nestjs/jwt';
import { StoresModule } from '../stores/stores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderItemEntity]),
    forwardRef(() => CustomersModule),
    JwtModule,
    StoresModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: OrderRepositoryTypeORM,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
