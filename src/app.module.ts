import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './commom/database/database.module';
import { HealthModule } from './infra/health/health.module';
import { CustomersModule } from './modules/customers/customers.module';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig],
    }),
    HealthModule,
    DatabaseModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
