import { randomUUID, pbkdf2Sync } from 'node:crypto';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { CoreException } from 'src-clean/common/exceptions/coreException';
import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src-clean/core/common/valueObjects/cnpj.vo';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';

interface StoreProps {
  id: string;
  name: string;
  fantasyName: string;
  email: Email;
  phone: BrazilianPhone;
  salt: string;
  passwordHash: string;
  cnpj: CNPJ;
  createdAt: Date;
}

export class Store {
  id: string;
  cnpj: CNPJ;
  name: string;
  fantasyName: string;
  email: Email;
  phone: BrazilianPhone;

  // TODO: create password value object
  salt: string;
  passwordHash: string;
  createdAt: Date;

  private constructor(props: StoreProps) {
    this.id = props.id;
    this.name = props.name;
    this.cnpj = props.cnpj;
    this.email = props.email;
    this.fantasyName = props.fantasyName;
    this.phone = props.phone;
    this.fantasyName = props.fantasyName;
    this.salt = props.salt;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;

    this.validate();
  }

  verifyPassword(plainPassword: string): boolean {
    const hash = pbkdf2Sync(
      plainPassword,
      this.salt,
      100_000,
      64,
      'sha512',
    ).toString('hex');

    return hash === this.passwordHash;
  }

  private validate() {
    if (!this.name) {
      throw new ResourceInvalidException('Name is required');
    }
    if (!(this.email instanceof Email)) {
      throw new ResourceInvalidException('Email must be an Email value object');
    }
    if (!this.salt) {
      throw new ResourceInvalidException('Salt is required');
    }
    if (!this.passwordHash) {
      throw new ResourceInvalidException('Password hash is required');
    }
    if (!this.id) {
      throw new ResourceInvalidException('ID is required');
    }
    if (!(this.cnpj instanceof CNPJ)) {
      throw new ResourceInvalidException('CNPJ must be a CNPJ value object');
    }
    if (!this.fantasyName) {
      throw new ResourceInvalidException('Fantasy name is required');
    }
    if (!this.phone) {
      throw new ResourceInvalidException('Phone is required');
    }
  }

  static create(props: {
    name: string;
    fantasyName: string;
    email: Email;
    cnpj: CNPJ;
    plainPassword: string;
    phone: BrazilianPhone;
  }): CoreResponse<Store> {
    const id = randomUUID();
    const salt = randomUUID();
    const passwordHash = pbkdf2Sync(
      props.plainPassword,
      salt,
      100_000,
      64,
      'sha512',
    ).toString('hex');

    try {
      const store = new Store({
        id,
        name: props.name,
        fantasyName: props.fantasyName,
        phone: props.phone,
        email: props.email,
        cnpj: props.cnpj,
        salt,
        passwordHash,
        createdAt: new Date(),
      });

      return { value: store, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  static restore(props: StoreProps): CoreResponse<Store> {
    try {
      const store = new Store(props);
      return { value: store, error: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }
}
