import { StoreDataSourceDTO } from 'src/common/dataSource/DTOs/storeDataSource.dto';
import { Store } from '../entities/store.entity';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { TotemMapper } from './totem.mapper';
import { Totem } from '../entities/totem.entity';
import { CoreException } from 'src/common/exceptions/coreException';

export class StoreMapper {
  static toEntity(dto: StoreDataSourceDTO): CoreResponse<Store> {
    const cnpj = CNPJ.create(dto.cnpj);
    if (cnpj.error) return { error: cnpj.error, value: undefined };

    const email = Email.create(dto.email);
    if (email.error) return { error: email.error, value: undefined };

    const phone = BrazilianPhone.create(dto.phone);
    if (phone.error) return { error: phone.error, value: undefined };

    const totems: Totem[] = [];

    try {
      dto.totems.forEach((totem) => {
        const { error, value } = TotemMapper.toEntity(totem);

        if (error) throw error;

        totems.push(value);
      });
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }

    return Store.restore({
      id: dto.id,
      name: dto.name,
      fantasyName: dto.fantasy_name,
      salt: dto.salt,
      passwordHash: dto.password_hash,
      createdAt: new Date(dto.created_at),
      phone: phone.value,
      email: email.value,
      cnpj: cnpj.value,
      totems: totems,
    });
  }

  static toPersistenceDTO(entity: Store): StoreDataSourceDTO {
    return {
      id: entity.id,
      name: entity.name,
      fantasy_name: entity.fantasyName,
      salt: entity.salt,
      password_hash: entity.passwordHash,
      created_at: entity.createdAt.toISOString(),
      cnpj: entity.cnpj.toString(),
      email: entity.email.toString(),
      phone: entity.phone.toString(),
      totems: entity.totems.map((totem) => TotemMapper.toPersistenceDTO(totem)),
    };
  }
}
