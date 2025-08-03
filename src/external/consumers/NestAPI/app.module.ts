import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { DataSourceModule } from './shared/data-source.module';
import { StoresModule } from './modules/stores/stores.module';
import { OrderModule } from './modules/order/order.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CategoryModule } from './modules/categories/category.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig],
    }),
    DataSourceModule,
    HealthModule,
    AuthModule,
    StoresModule,
    OrderModule,
    CustomerModule,
    CategoryModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
