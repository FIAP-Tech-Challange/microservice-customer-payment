import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../../models/entities/store.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StoreModel } from '../../models/domain/store.model';
import { TotemEntity } from '../../models/entities/totem.entity';
import { StoresRepositoryPort } from '../../ports/output/stores.repository.port';
import { StoreMapper } from '../../models/store.mapper';
import { Email } from 'src/shared/domain/email.vo';
import { CNPJ } from '../../models/domain/cnpj.vo';

@Injectable()
export class StoresRepositoryTypeORM implements StoresRepositoryPort {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeEntity: Repository<StoreEntity>,
    @InjectRepository(TotemEntity)
    private readonly totemEntity: Repository<TotemEntity>,
  ) {}

  async findByCnpj(cnpj: CNPJ) {
    const store = await this.storeEntity.findOne({
      where: { cnpj: cnpj.toString() },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return StoreMapper.toDomain(store);
  }

  async save(store: StoreModel) {
    await this.storeEntity.save(StoreMapper.toEntity(store));
  }

  async findByEmail(email: Email) {
    const store = await this.storeEntity.findOne({
      where: { email: email.toString() },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return StoreMapper.toDomain(store);
  }

  async findById(id: string) {
    const store = await this.storeEntity.findOne({
      where: { id },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return StoreMapper.toDomain(store);
  }

  async findByTotemAccessToken(tokenAccess: string) {
    const totem = await this.totemEntity.findOne({
      where: { token_access: tokenAccess },
      relations: ['store'],
    });

    if (!totem) {
      return null;
    }

    return StoreMapper.toDomain(totem.store);
  }
}
