import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotemModel } from 'src/common/database/models/totem.model';
import { StoreModel } from 'src/common/database/models/store.model';
import { StoresRepositoryTypeorm } from './adapters/stores.repository.typeorm';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([TotemModel, StoreModel])],
  controllers: [StoresController],
  providers: [
    StoresService,
    { provide: 'StoresRepository', useClass: StoresRepositoryTypeorm },
  ],
  exports: [StoresService],
})
export class StoresModule {}
