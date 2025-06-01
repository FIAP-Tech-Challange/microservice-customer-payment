import { Email } from 'src/shared/domain/email.vo';
import { CNPJ } from './domain/cnpj.vo';
import { StoreModel } from './domain/store.model';
import { SimplifiedStoreDto } from './dtos/simplified-store.dto';
import { StoreEntity } from './entities/store.entity';
import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';
import { TotemMapper } from './totem.mapper';

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
      totems: entity.totems.map((totem) => TotemMapper.toDomain(totem)),
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
    storeEntity.totems = entity.totems.map((totem) =>
      TotemMapper.toEntity(totem),
    );

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
      totems: store.totems.map((t) =>
        TotemMapper.fromDomainToSimplifiedTotemDto(t),
      ),
    };
  }
}
