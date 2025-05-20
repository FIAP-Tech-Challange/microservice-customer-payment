import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../models/entities/store.entity';
import { StoresRepository } from '../ports/stores.repository';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { StoreModel } from '../models/domain/store.model';
import { TotemModel } from '../models/domain/totem.model';
import { TotemEntity } from '../models/entities/totem.entity';

@Injectable()
export class StoresRepositoryTypeorm implements StoresRepository {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeEntity: Repository<StoreEntity>,
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

  async create(store: StoreModel): Promise<void> {
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
        }),
      ),
    });
  }

  private toEntity(entity: StoreModel): StoreEntity {
    const model = new StoreEntity();
    model.id = entity.id;
    model.cnpj = entity.cnpj;
    model.email = entity.email;
    model.fantasy_name = entity.fantasyName;
    model.name = entity.name;
    model.phone = entity.phone;
    model.password_hash = entity.passwordHash;
    model.salt = entity.salt;
    model.created_at = entity.createdAt;
    model.is_active = entity.isActive;
    model.totems = entity.totems.map((totem) => {
      const totemModel = new TotemEntity();
      totemModel.id = totem.id;
      totemModel.name = totem.name;
      totemModel.is_active = totem.isActive;
      totemModel.token_access = totem.tokenAccess;
      return totemModel;
    });

    return model;
  }
}
