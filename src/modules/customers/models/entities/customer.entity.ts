import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  static create(props: {
    id: string;
    cpf: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const customer = new CustomerEntity();
    customer.id = props.id;
    customer.cpf = props.cpf;
    customer.name = props.name;
    customer.email = props.email;
    customer.createdAt = props.createdAt;
    customer.updatedAt = props.updatedAt;
    return customer;
  }

  @PrimaryColumn('uuid')
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
}
