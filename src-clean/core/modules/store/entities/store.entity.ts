import { randomUUID, pbkdf2Sync } from 'node:crypto';
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
      throw new Error('Name is required');
    }
    if (!(this.email instanceof Email)) {
      throw new Error('Email must be an Email value object');
    }
    if (!this.salt) {
      throw new Error('Salt is required');
    }
    if (!this.passwordHash) {
      throw new Error('Password hash is required');
    }
    if (!this.id) {
      throw new Error('ID is required');
    }
    if (!(this.cnpj instanceof CNPJ)) {
      throw new Error('CNPJ must be a CNPJ value object');
    }
    if (!this.fantasyName) {
      throw new Error('Fantasy name is required');
    }
    if (!this.phone) {
      throw new Error('Phone is required');
    }
  }

  static create(props: {
    name: string;
    fantasyName: string;
    email: Email;
    cnpj: CNPJ;
    plainPassword: string;
    phone: BrazilianPhone;
  }): Store {
    const id = randomUUID();
    const salt = randomUUID();
    const passwordHash = pbkdf2Sync(
      props.plainPassword,
      salt,
      100_000,
      64,
      'sha512',
    ).toString('hex');

    return new Store({
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
  }

  static restore(props: StoreProps): Store {
    return new Store(props);
  }
}
