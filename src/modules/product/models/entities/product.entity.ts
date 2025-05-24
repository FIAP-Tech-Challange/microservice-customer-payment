import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductModel } from '../domain/product.model';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: false })
  prep_time: number;

  @Column({ type: 'varchar', nullable: true })
  image_url: string;

  @Column({ type: 'int', nullable: false })
  category_id: number;

  @Column({ type: 'int', nullable: false })
  store_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  toModel(): ProductModel {
    return ProductModel.fromProps({
      id: this.id,
      name: this.name,
      price: parseFloat(this.price),
      status: this.status,
      description: this.description,
      prep_time: this.prep_time,
      image_url: this.image_url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  updateFromModel(model: Partial<ProductModel>): void {
    if (model.name) this.name = model.name;
    if (model.price !== undefined) this.price = model.price.toString();
    if (model.status) this.status = model.status;
    if (model.description) this.description = model.description;
    if (model.prep_time !== undefined) this.prep_time = model.prep_time;
    if (model.image_url) this.image_url = model.image_url;
    //if (model.category_id !== undefined) this.category_id = model.category_id;
    //if (model.store_id !== undefined) this.store_id = model.store_id;
  }
}