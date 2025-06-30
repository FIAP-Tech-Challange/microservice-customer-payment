import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import paidMarketConfig from './infra/config/paid-market.config';
import { AuthModule } from './modules/auth/auth.module';
import { StoreModule } from './modules/store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig, paidMarketConfig],
    }),
    HealthModule,
    AuthModule,
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
