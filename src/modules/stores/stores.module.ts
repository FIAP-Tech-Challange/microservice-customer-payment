import { Module } from '@nestjs/common';
import { StoresController } from './adapters/primary/stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepositoryTypeORM } from './adapters/secondary/stores.repository.typeorm';
import { StoresService } from './services/stores.service';
import { TotemEntity } from './models/entities/totem.entity';
import { StoreEntity } from './models/entities/store.entity';
import { STORE_REPOSITORY_PORT_KEY } from './ports/output/stores.repository.port';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';
import { TOTEMS_REPOSITORY_PORT_KEY } from './ports/output/totems.repository.port';
import { TotemsRepositoryTypeORM } from './adapters/secondary/totems.repository.typeorm';
import { CategoryModule } from '../categories/category.module';

@Module({
  imports: [
    NotificationModule,
    CategoryModule,
    JwtModule,
    TypeOrmModule.forFeature([TotemEntity, StoreEntity]),
  ],
  controllers: [StoresController],
  providers: [
    StoresService,
    {
      provide: TOTEMS_REPOSITORY_PORT_KEY,
      useClass: TotemsRepositoryTypeORM,
    },
    {
      provide: STORE_REPOSITORY_PORT_KEY,
      useClass: StoresRepositoryTypeORM,
    },
  ],
  exports: [StoresService],
})
export class StoresModule {}
