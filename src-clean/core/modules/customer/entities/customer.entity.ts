import { randomUUID } from 'node:crypto';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CoreException } from 'src-clean/common/exceptions/coreException';
import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';
import { CPF } from 'src-clean/core/common/valueObjects/cpf.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';

interface CustomerProps {
  id: string;
  cpf: CPF;
  name: string;
  email: Email;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer {
  private _id: string;
  private _cpf: CPF;
  private _name: string;
  private _email: Email;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CustomerProps) {
    this._id = props.id;
    this._cpf = props.cpf;
    this._name = props.name;
    this._email = props.email;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get cpf(): CPF {
    return this._cpf;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validate(): void {
    if (!this._id || this._id.trim() === '') {
      throw new ResourceInvalidException('Customer ID is required');
    }

    if (!this._cpf) {
      throw new ResourceInvalidException('Customer CPF is required');
    }

    if (!this._name || this._name.trim() === '') {
      throw new ResourceInvalidException('Customer name is required');
    }

    if (this._name.trim().length < 3) {
      throw new ResourceInvalidException('Customer name must be at least 3 characters long');
    }

    if (!this._email) {
      throw new ResourceInvalidException('Customer email is required');
    }

    if (!this._createdAt) {
      throw new ResourceInvalidException('Customer createdAt is required');
    }

    if (!this._updatedAt) {
      throw new ResourceInvalidException('Customer updatedAt is required');
    }
  }

  public static create(props: {
    cpf: string;
    name: string;
    email: string;
  }): CoreResponse<Customer> {
    try {
      const { error: cpfError, value: cpf } = CPF.create(props.cpf);
      if (cpfError) {
        return { error: cpfError, value: undefined };
      }

      const { error: emailError, value: email } = Email.create(props.email);
      if (emailError) {
        return { error: emailError, value: undefined };
      }

      const customer = new Customer({
        id: randomUUID(),
        cpf: cpf!,
        name: props.name.trim(),
        email: email!,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { value: customer, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }

  public static fromProps(props: CustomerProps): CoreResponse<Customer> {
    try {
      const customer = new Customer(props);
      return { value: customer, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }

  public update(props: {
    name?: string;
    email?: string;
  }): CoreResponse<Customer> {
    try {
      const updatedProps: CustomerProps = {
        id: this._id,
        cpf: this._cpf,
        name: props.name?.trim() || this._name,
        email: this._email,
        createdAt: this._createdAt,
        updatedAt: new Date(),
      };

      if (props.email) {
        const { error: emailError, value: email } = Email.create(props.email);
        if (emailError) {
          return { error: emailError, value: undefined };
        }
        updatedProps.email = email!;
      }

      const customer = new Customer(updatedProps);
      return { value: customer, error: undefined };
    } catch (error) {
      return {
        error: error as CoreException,
        value: undefined,
      };
    }
  }
}
