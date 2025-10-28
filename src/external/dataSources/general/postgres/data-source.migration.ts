import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
//import * as fs from 'fs';
//import * as path from 'path';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_PG_HOST,
  port: Number(process.env.DB_PG_PORT),
  username: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_NAME,
  entities: [
    CustomerEntity,
  ],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
  /*ssl: {
    ca: fs
      .readFileSync(
        path.join(process.cwd(), 'certs', 'rds-combined-ca-bundle.pem'),
      )
      .toString(),
  },*/
};

const dataSource = new DataSource(dataSourceOptions);
module.exports = dataSource;
