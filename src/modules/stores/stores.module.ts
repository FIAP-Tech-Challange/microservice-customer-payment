import { Module } from '@nestjs/common';
import { StoresController } from './adapters/primary/stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepositoryTypeorm } from './adapters/secondary/stores.repository.typeorm';
import { StoresService } from './stores.service';
import { TotemEntity } from './models/entities/totem.entity';
import { StoreEntity } from './models/entities/store.entity';
import { STORE_REPOSITORY_PORT_KEY } from './ports/output/stores.repository.port';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    JwtModule,
    TypeOrmModule.forFeature([TotemEntity, StoreEntity]),
  ],
  controllers: [StoresController],
  providers: [
    StoresService,
    {
      provide: STORE_REPOSITORY_PORT_KEY,
      useClass: StoresRepositoryTypeorm,
    },
  ],
  exports: [StoresService],
})
export class StoresModule {}
