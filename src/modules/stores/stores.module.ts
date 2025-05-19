import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotemModel } from 'src/common/database/models/totem.model';
import { StoreModel } from 'src/common/database/models/store.model';
import { StoreService } from './stores.service';
import { StoreRepositoryTypeOrm } from './adapters/stores.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TotemModel, StoreModel])],
  controllers: [StoresController],
  providers: [
    StoreService,
    {
      provide: 'StoreRepository',
      useClass: StoreRepositoryTypeOrm,
    },
  ],
  exports: [StoreService],
})
export class StoresModule {}
