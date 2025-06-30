import { DataSource } from 'typeorm';
import { StoreEntity } from './entities/store.entity';

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
      entities: [StoreEntity],
      synchronize: false, // Use migrations in production
      logging: false,
    });
  }
}
