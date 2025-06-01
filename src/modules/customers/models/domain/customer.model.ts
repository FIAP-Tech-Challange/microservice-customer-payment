import { CPF } from 'src/shared/domain/cpf.vo';
import { Email } from 'src/shared/domain/email.vo';

interface CustomerProps {
  id: string;
  cpf: CPF;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerModel {
  id: string;
  cpf: CPF;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt: Date;

  private constructor(props: CustomerProps) {
    this.id = props.id;
    this.cpf = props.cpf;
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.validate();
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
    if (this.name.length < 3) {
      throw new Error('Name must be at least 3 characters long');
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
    return customer;
  }

  static fromProps(props: CustomerProps): CustomerModel {
    const model = new CustomerModel(props);
    return model;
  }
}
