import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { StoreEntity } from './store.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: false })
  prep_time: number;

  @Column({ nullable: true })
  image_url?: string;

  @Column({ type: 'uuid', nullable: false })
  category_id: string;

  @Column({ type: 'uuid', nullable: false })
  store_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @ManyToOne(() => StoreEntity, (store) => store.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
