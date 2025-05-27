import { Email } from 'src/shared/domain/email.vo';
import { CNPJ } from './domain/cnpj.vo';
import { StoreModel } from './domain/store.model';
import { TotemModel } from './domain/totem.model';
import { SimplifiedStoreDto } from './dtos/simplified-store.dto';
import { StoreEntity } from './entities/store.entity';
import { TotemEntity } from './entities/totem.entity';
import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';

export class StoreMapper {
  static toDomain(entity: StoreEntity) {
    return StoreModel.restore({
      id: entity.id,
      cnpj: new CNPJ(entity.cnpj),
      email: new Email(entity.email),
      fantasyName: entity.fantasy_name,
      name: entity.name,
      phone: new BrazilianPhone(entity.phone),
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

  static toEntity(entity: StoreModel) {
    const storeEntity = new StoreEntity();
    storeEntity.id = entity.id;
    storeEntity.cnpj = entity.cnpj.toString();
    storeEntity.email = entity.email.toString();
    storeEntity.fantasy_name = entity.fantasyName;
    storeEntity.name = entity.name;
    storeEntity.phone = entity.phone.toString();
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

  static fromDomainToSimplifiedStoreDto(store: StoreModel): SimplifiedStoreDto {
    return {
      id: store.id,
      name: store.name,
      fantasyName: store.fantasyName,
      email: store.email.toString(),
      phone: store.phone.toString(),
      cnpj: store.cnpj.toString(),
      isActive: store.isActive,
      totems: store.totems.map((t) => ({
        id: t.id,
        name: t.name,
        tokenAccess: t.tokenAccess,
        isActive: t.isActive,
      })),
    };
  }
}
