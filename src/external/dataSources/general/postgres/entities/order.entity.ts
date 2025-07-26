import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusEnum } from 'src/core/modules/order/entities/order.entity';
import { CustomerEntity } from './customer.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  customer_id: string | null;

  @Column({ type: 'simple-enum', enum: OrderStatusEnum, nullable: false })
  status: OrderStatusEnum;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total_price: number;

  @Column({ type: 'uuid', nullable: false })
  store_id: string;

  @Column({ type: 'uuid', nullable: true })
  totem_id: string | null;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  order_items: OrderItemEntity[];

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity | null;
}
