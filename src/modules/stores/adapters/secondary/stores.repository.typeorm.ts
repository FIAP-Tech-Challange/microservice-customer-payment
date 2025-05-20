import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../../models/entities/store.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StoreModel } from '../../models/domain/store.model';
import { TotemModel } from '../../models/domain/totem.model';
import { TotemEntity } from '../../models/entities/totem.entity';
import { StoresRepositoryPort } from '../../ports/output/stores.repository.port';

@Injectable()
export class StoresRepositoryTypeorm implements StoresRepositoryPort {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeEntity: Repository<StoreEntity>,
    @InjectRepository(TotemEntity)
    private readonly totemEntity: Repository<TotemEntity>,
  ) {}

  async findByCnpj(cnpj: string): Promise<StoreModel | null> {
    const store = await this.storeEntity.findOne({
      where: { cnpj },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return this.toDomain(store);
  }

  async save(store: StoreModel): Promise<void> {
    await this.storeEntity.save(this.toEntity(store));
  }

  async findByEmail(email: string): Promise<StoreModel | null> {
    const store = await this.storeEntity.findOne({
      where: { email },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return this.toDomain(store);
  }

  async findById(id: string): Promise<StoreModel | null> {
    const store = await this.storeEntity.findOne({
      where: { id },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return this.toDomain(store);
  }

  private toDomain(entity: StoreEntity): StoreModel {
    return StoreModel.restore({
      id: entity.id,
      cnpj: entity.cnpj,
      email: entity.email,
      fantasyName: entity.fantasy_name,
      name: entity.name,
      phone: entity.phone,
      passwordHash: entity.password_hash,
      salt: entity.salt,
      createdAt: entity.created_at,
      isActive: entity.is_active,
      totems: entity.totems.map((totem) =>
        TotemModel.restore({
          id: totem.id,
          name: totem.name,
          isActive: totem.is_active,
          tokenAccess: totem.token_access,
          createdAt: totem.created_at,
        }),
      ),
    });
  }

  private toEntity(entity: StoreModel): StoreEntity {
    const storeEntity = new StoreEntity();
    storeEntity.id = entity.id;
    storeEntity.cnpj = entity.cnpj;
    storeEntity.email = entity.email;
    storeEntity.fantasy_name = entity.fantasyName;
    storeEntity.name = entity.name;
    storeEntity.phone = entity.phone;
    storeEntity.password_hash = entity.passwordHash;
    storeEntity.salt = entity.salt;
    storeEntity.created_at = entity.createdAt;
    storeEntity.is_active = entity.isActive;
    storeEntity.totems = entity.totems.map((totem) => {
      const totemEntity = new TotemEntity();
      totemEntity.id = totem.id;
      totemEntity.store_id = storeEntity.id;
      totemEntity.name = totem.name;
      totemEntity.is_active = totem.isActive;
      totemEntity.token_access = totem.tokenAccess;
      totemEntity.created_at = totem.createdAt;
      return totemEntity;
    });

    return storeEntity;
  }
}
