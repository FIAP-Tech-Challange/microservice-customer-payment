import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { TotemEntity } from './entities/totem.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { CustomerEntity } from './entities/customer.entity';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from './entities/product.entity';
import { NotificationEntity } from './entities/notification.entity';
import { PaymentEntity } from './entities/payment.entity';
import * as fs from 'fs';
import * as path from 'path';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_PG_HOST,
  port: Number(process.env.DB_PG_PORT),
  username: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_NAME,
  entities: [
    StoreEntity,
    TotemEntity,
    OrderEntity,
    OrderItemEntity,
    PaymentEntity,
    CategoryEntity,
    ProductEntity,
    NotificationEntity,
    CustomerEntity,
  ],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
  ssl: {
    ca: fs
      .readFileSync(
        path.join(process.cwd(), 'certs', 'rds-combined-ca-bundle.pem'),
      )
      .toString(),
  },
};

const dataSource = new DataSource(dataSourceOptions);
module.exports = dataSource;
