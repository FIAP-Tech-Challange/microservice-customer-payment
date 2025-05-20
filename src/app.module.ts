import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import applicationConfig from './infra/config/application.config';
import databaseConfig from './infra/config/database.config';
import { DatabaseModule } from './common/database/database.module';
import { HealthModule } from './infra/health/health.module';
import { StoresModule } from './modules/stores/stores.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [applicationConfig, databaseConfig],
    }),
    HealthModule,
    DatabaseModule,
    StoresModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
