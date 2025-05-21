import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { DatabaseModule } from './common/database/database.module';
import { HealthModule } from './infra/health/health.module';
import { PaymentModule } from './modules/payment/payment.module';
import paidMarketConfig from './infra/config/paid-market.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig, paidMarketConfig],
    }),
    HealthModule,
    DatabaseModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
