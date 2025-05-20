import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerModel } from '../customer.model';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, length: 11 })
  cpf: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  toModel(): CustomerModel {
    const model = new CustomerModel();
    model.id = this.id;
    model.cpf = this.cpf;
    model.name = this.name;
    model.email = this.email;
    model.created_at = this.createdAt;
    model.updated_at = this.updatedAt;
    return model;
  }

  updateFromModel(model: Partial<CustomerModel>): void {
    if (model.cpf) this.cpf = model.cpf;
    if (model.name) this.name = model.name;
    if (model.email) this.email = model.email;
  }
}
