import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { ProductModel } from '../domain/product.model';

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

  @Column({ nullable: false })
  is_active: boolean;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toModel(): ProductModel {
    return ProductModel.fromProps({
      id: this.id,
      name: this.name,
      price: parseFloat(this.price),
      is_active: this.is_active,
      description: this.description,
      prep_time: this.prep_time,
      image_url: this.image_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
    });
  }
}
