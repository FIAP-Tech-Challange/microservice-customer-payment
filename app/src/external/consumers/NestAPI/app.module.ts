import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './infra/health/health.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { DataSourceModule } from './shared/data-source.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig],
    }),
    DataSourceModule,
    HealthModule,
    AuthModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
