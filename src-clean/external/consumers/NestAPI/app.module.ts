import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import paidMarketConfig from './infra/config/paid-market.config';
import { AuthModule } from './modules/auth/auth.module';
import { DataSourceModule } from './shared/data-source.module';
import { StoresModule } from './modules/stores/stores.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig, paidMarketConfig],
    }),
    DataSourceModule,
    HealthModule,
    AuthModule,
    StoresModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
