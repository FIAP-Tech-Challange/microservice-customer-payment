import { DataSource, Repository } from 'typeorm';
import { GeneralDataSource } from '../general.dataSource';
import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';
import { StoreEntity } from './entities/store.entity';

export class CleanPostgresGeneralDataSource implements GeneralDataSource {
  private storeRepository: Repository<StoreEntity>;

  constructor(private dataSource: DataSource) {
    this.storeRepository = this.dataSource.getRepository(StoreEntity);
  }

  async findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null> {
    const store = await this.storeRepository.findOne({
      where: { email: email },
    });

    if (!store) return null;

    return {
      id: store.id,
      name: store.name,
      fantasy_name: store.fantasy_name,
      email: store.email,
      cnpj: store.cnpj,
      phone: store.phone,
      salt: store.salt,
      password_hash: store.password_hash,
      created_at: store.created_at.toISOString(),
    };
  }
}
