import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { TotemEntity } from './totem.entity';
import { ProductEntity } from 'src/modules/categories/models/entities/product.entity';
import { CategoryEntity } from 'src/modules/categories/models/entities/category.entity';

@Entity('stores')
export class StoreEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  cnpj: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  fantasy_name: string;

  @Column()
  phone: string;

  @Column()
  salt: string;

  @Column()
  password_hash: string;

  @Column()
  created_at: Date;

  @OneToMany(() => TotemEntity, (totem) => totem.store, {
    cascade: true,
    eager: true,
  })
  totems: TotemEntity[];

  @OneToMany(() => ProductEntity, (product) => product.store, {
    cascade: true,
    eager: false,
  })
  products: ProductEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.store, {
    cascade: true,
    eager: false,
  })
  categories: CategoryEntity[];
}
