import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresRepositoryTypeorm } from './adapters/stores.repository.typeorm';
import { StoresService } from './stores.service';
import { TotemEntity } from './models/entities/totem.entity';
import { StoreEntity } from './models/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotemEntity, StoreEntity])],
  controllers: [StoresController],
  providers: [
    StoresService,
    { provide: 'StoresRepository', useClass: StoresRepositoryTypeorm },
  ],
  exports: [StoresService],
})
export class StoresModule {}
