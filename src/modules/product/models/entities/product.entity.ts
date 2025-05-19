import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductModel } from '../product.model';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  prep_time: number;

  @Column({ type: 'varchar', nullable: true })
  image_url: string;

  @Column({ type: 'int' })
  category_id: number;

  @Column({ type: 'int' })
  store_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Método para converter a entidade em modelo
  toModel(): ProductModel {
    const model = new ProductModel();
    model.id = this.id;
    model.name = this.name;
    model.price = this.price;
    model.status = this.status;
    model.description = this.description;
    model.prep_time = this.prep_time;
    model.image_url = this.image_url;
    // model.category_id = this.category_id;
    // model.store_id = this.store_id;
    model.created_at = this.createdAt; // Corrigido para manter consistência com o nome do campo
    return model;
  }

  // Método para atualizar a entidade a partir de um DTO
  updateFromDto(dto: Partial<ProductModel>): void {
    if (dto.name) this.name = dto.name;
    if (dto.price) this.price = dto.price;
    if (dto.status) this.status = dto.status;
    if (dto.description) this.description = dto.description;
    if (dto.prep_time !== undefined) this.prep_time = dto.prep_time;
    if (dto.image_url) this.image_url = dto.image_url;
    // if (dto.category_id !== undefined) this.category_id = dto.category_id;
    // if (dto.store_id !== undefined) this.store_id = dto.store_id;
  }
}