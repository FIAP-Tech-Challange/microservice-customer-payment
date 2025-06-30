import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { Store } from '../entities/store.entity';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';

export class StoreMapper {
  static toEntity(dto: StoreDataSourceDTO): CoreResponse<Store> {
    const cnpj = new CNPJ(dto.cnpj);
    const email = new Email(dto.email);
    const phone = new BrazilianPhone(dto.phone);

    return Store.restore({
      id: dto.id,
      name: dto.name,
      fantasyName: dto.name,
      salt: dto.salt,
      passwordHash: dto.password_hash,
      createdAt: new Date(dto.created_at),
      phone: phone,
      email: email,
      cnpj: cnpj,
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
    };
  }
}
