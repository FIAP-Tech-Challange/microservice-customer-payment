import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerModel } from '../domain/customer.model';

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
    return CustomerModel.fromProps({
      id: this.id,
      cpf: this.cpf,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }

  updateFromModel(model: Partial<CustomerModel>): void {
    if (model.cpf) this.cpf = model.cpf;
    if (model.name) this.name = model.name;
    if (model.email) this.email = model.email;
  }
}
