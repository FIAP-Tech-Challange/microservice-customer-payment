import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { CustomerEntity } from '../../../customers/models/entities/customer.entity';
import { OrderStatusEnum } from '../enum/order-status.enum';

@Entity('order')
export class OrderEntity {
  static create(props: {
    id: string;
    customer_id: string | null;
    customer: CustomerEntity | null;
    status: OrderStatusEnum;
    total_price: number;
    store_id: string;
    totem_id: string | null;
    created_at: Date;
    order_items: OrderItemEntity[];
  }) {
    const order = new OrderEntity();
    order.id = props.id;
    order.customer_id = props.customer_id;
    order.customer = props.customer;
    order.status = props.status;
    order.total_price = props.total_price;
    order.store_id = props.store_id;
    order.totem_id = props.totem_id;
    order.created_at = props.created_at;
    order.order_items = props.order_items;
    return order;
  }

  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  customer_id: string | null;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerEntity | null;

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
}
