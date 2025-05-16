import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../entities/store.entity';
import { StoreRepository } from '../ports/stores.repository';
import { StoreModel } from 'src/common/database/models/store.model';
import { Repository } from 'typeorm';
import { TotemModel } from 'src/common/database/models/totem.model';
import { Totem } from '../entities/totem.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreRepositoryTypeOrm implements StoreRepository {
  constructor(
    @InjectRepository(StoreModel)
    private readonly storeModel: Repository<StoreModel>,
  ) {}

  async findByCnpj(cnpj: string): Promise<Store | null> {
    const store = await this.storeModel.findOne({ where: { cnpj } });

    if (!store) {
      return null;
    }

    return this.toEntity(store);
  }

  async create(store: Store): Promise<void> {
    const storeModel = this.toModel(store);
    await this.storeModel.save(storeModel);
  }

  async findById(id: string): Promise<Store | null> {
    const store = await this.storeModel.findOne({
      where: { id },
      relations: ['totems'],
    });

    if (!store) {
      return null;
    }

    return this.toEntity(store);
  }

  private toEntity(model: StoreModel): Store {
    return Store.restore({
      id: model.id,
      cnpj: model.cnpj,
      email: model.email,
      fantasyName: model.fantasy_name,
      name: model.name,
      phone: model.phone,
      passwordHash: model.password_hash,
      salt: model.salt,
      createdAt: model.created_at,
      isActive: model.is_active,
      totems: model.totems.map((totem) =>
        Totem.restore({
          id: totem.id,
          name: totem.name,
          isActive: totem.is_active,
          tokenAccess: totem.token_access,
        }),
      ),
    });
  }

  private toModel(entity: Store): StoreModel {
    const model = new StoreModel();
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
      const totemModel = new TotemModel();
      totemModel.id = totem.id;
      totemModel.name = totem.name;
      totemModel.is_active = totem.isActive;
      totemModel.token_access = totem.tokenAccess;
      return totemModel;
    });

    return model;
  }
}
