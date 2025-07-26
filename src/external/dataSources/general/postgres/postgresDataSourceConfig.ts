import { DataSource } from 'typeorm';
import { StoreEntity } from './entities/store.entity';
import { TotemEntity } from './entities/totem.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { CustomerEntity } from './entities/customer.entity';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from './entities/product.entity';
import { PaymentEntity } from './entities/payment.entity';

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
        StoreEntity,
        TotemEntity,
        OrderEntity,
        OrderItemEntity,
        CustomerEntity,
        ProductEntity,
        CategoryEntity,
        PaymentEntity,
      ],
      synchronize: false,
      logging: false,
    });
  }
}
