import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './commom/database/database.module';
import { HealthModule } from './infra/health/health.module';
import { ProductModule } from './modules/product/product.module'; // Importa o módulo de produtos
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
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}