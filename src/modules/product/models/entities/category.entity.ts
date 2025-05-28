import { StoreEntity } from 'src/modules/stores/models/entities/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  is_active: boolean;

  @Column()
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

  @OneToMany(() => ProductEntity, (product) => product.category, {
    cascade: true,
    eager: true,
  })
  products: ProductEntity[];
}
