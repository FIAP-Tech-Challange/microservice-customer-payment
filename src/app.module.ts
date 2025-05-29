import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import { CustomersModule } from './modules/customers/customers.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { PaymentModule } from './modules/payment/payment.module';
import paidMarketConfig from './infra/config/paid-market.config';
import { DatabaseModule } from './common/database/database.module';
import { StoresModule } from './modules/stores/stores.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { CategoryModule } from './modules/categories/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig, paidMarketConfig],
    }),
    HealthModule,
    DatabaseModule,
    CategoryModule,
    CustomersModule,
    PaymentModule,
    StoresModule,
    AuthModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
