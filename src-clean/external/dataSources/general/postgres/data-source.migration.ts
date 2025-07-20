import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { TotemEntity } from './entities/totem.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { CustomerEntity } from './entities/customer.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_PG_HOST,
  port: Number(process.env.DB_PG_PORT),
  username: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_NAME,
  entities: [StoreEntity, TotemEntity, OrderEntity, OrderItemEntity, CustomerEntity],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
module.exports = dataSource;
