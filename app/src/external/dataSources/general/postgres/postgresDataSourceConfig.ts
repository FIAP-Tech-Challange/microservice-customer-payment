import { DataSource } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { PaymentEntity } from './entities/payment.entity';
import * as fs from 'fs';
import * as path from 'path';

export interface PostgresConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  nodeEnv?: string;
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
        PaymentEntity,
      ],
      synchronize: false,
      logging: false,
      ssl: config.nodeEnv === 'development' ? false : {
        ca: fs
          .readFileSync(
            path.join(process.cwd(), 'certs', 'rds-combined-ca-bundle.pem'),
          )
          .toString(),
      },
    });
  }
}
