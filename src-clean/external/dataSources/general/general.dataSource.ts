import { StoreDataSourceDTO } from 'src-clean/common/dataSource/DTOs/storeDataSource.dto';

export interface GeneralDataSource {
  findStoreByEmail(email: string): Promise<StoreDataSourceDTO | null>;
}
