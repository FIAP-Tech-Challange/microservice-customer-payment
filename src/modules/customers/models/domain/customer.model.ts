import { Email } from 'src/shared/domain/email.vo';

interface CustomerProps {
  id: string;
  cpf: string;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerModel {
  id: string;
  cpf: string;
  name: string;
  email: Email;
  created_at: Date;
  updated_at: Date;

  private constructor(props: CustomerProps) {
    this.id = props.id;
    this.cpf = props.cpf;
    this.name = props.name;
    this.email = props.email;
    this.created_at = props.createdAt;
    this.updated_at = props.updatedAt;
  }

  private validate() {
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!this.cpf) {
      throw new Error('CPF is required');
    }
    if (!this.name) {
      throw new Error('Name is required');
    }
    if (!this.email) {
      throw new Error('Email is required');
    }
  }

  static create(
    props: Omit<CustomerProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): CustomerModel {
    const customer = new CustomerModel({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    customer.validate();
    return customer;
  }

  static fromProps(props: CustomerProps): CustomerModel {
    const model = new CustomerModel(props);
    model.validate();
    return model;
  }
}
