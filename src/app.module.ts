import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './infra/health/health.module';
import { CustomersModule } from './modules/customers/customers.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { PaymentModule } from './modules/payment/payment.module';
import paidMarketConfig from './infra/config/paid-market.config';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig, paidMarketConfig],
    }),
    HealthModule,
    DatabaseModule,
    CustomersModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
