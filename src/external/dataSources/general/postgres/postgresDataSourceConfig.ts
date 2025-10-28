import { DataSource } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
//import * as fs from 'fs';
//import * as path from 'path';

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
      entities: [
        CustomerEntity,
      ],
      synchronize: false,
      logging: false,
      /*ssl: {
        ca: fs
          .readFileSync(
            path.join(process.cwd(), 'certs', 'rds-combined-ca-bundle.pem'),
          )
          .toString(),
      },*/
    });
  }
}
