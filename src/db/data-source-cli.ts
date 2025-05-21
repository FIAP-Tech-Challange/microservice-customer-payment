import 'dotenv/config';
import { PaymentEntity } from 'src/modules/payment/models/entities/payment.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_PG_HOST,
  port: Number(process.env.DB_PG_PORT),
  username: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_NAME,
  entities: [PaymentEntity],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
module.exports = dataSource;
