import { DataSource } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { TotemEntity } from './entities/totem.entity';

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export class PostgresDataSourceConfig {
  static create(config: PostgresConfig): DataSource {
    return new DataSource({
      type: 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [StoreEntity, TotemEntity],
      synchronize: false,
      logging: false,
    });
  }
}
