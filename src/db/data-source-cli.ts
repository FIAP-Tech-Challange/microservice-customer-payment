import 'dotenv/config';
import { PaymentEntity } from 'src/modules/payment/models/entities/payment.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CustomerEntity } from '../modules/customers/models/entities/customer.entity';
import { StoreEntity } from 'src/modules/stores/models/entities/store.entity';
import { TotemEntity } from 'src/modules/stores/models/entities/totem.entity';
import { OrderEntity } from 'src/modules/order/models/entities/order.entity';
import { OrderItemEntity } from 'src/modules/order/models/entities/order-item.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_PG_HOST,
  port: Number(process.env.DB_PG_PORT),
  username: process.env.DB_PG_USER,
  password: process.env.DB_PG_PASSWORD,
  database: process.env.DB_PG_NAME,
  entities: [
    CustomerEntity,
    PaymentEntity,
    StoreEntity,
    TotemEntity,
    OrderEntity,
    OrderItemEntity,
  ],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
module.exports = dataSource;
