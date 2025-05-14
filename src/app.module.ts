import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { DatabaseModule } from './commom/database/database.module';
import { HealthModule } from './infra/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig],
    }),
    HealthModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
