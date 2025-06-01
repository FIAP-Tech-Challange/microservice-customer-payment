import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_item')
export class OrderItemEntity {
  static create(props: {
    id: string;
    order_id: string;
    product_id: string;
    unit_price: number;
    subtotal: number;
    quantity: number;
    created_at: Date;
  }) {
    const orderItem = new OrderItemEntity();
    orderItem.id = props.id;
    orderItem.order_id = props.order_id;
    orderItem.product_id = props.product_id;
    orderItem.unit_price = props.unit_price;
    orderItem.subtotal = props.subtotal;
    orderItem.quantity = props.quantity;
    orderItem.created_at = props.created_at;
    return orderItem;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  order_id: string;

  @Column({ type: 'uuid', nullable: false })
  product_id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  unit_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  subtotal: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => OrderEntity, (order) => order.order_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
