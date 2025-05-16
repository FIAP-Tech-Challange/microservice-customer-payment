import { randomUUID, pbkdf2Sync } from 'node:crypto';
import { Totem } from './totem.entity';

interface StoreProps {
  id: string;
  name: string;
  fantasyName: string;
  email: string;
  phone: string;
  salt: string;
  passwordHash: string;
  cnpj: string;
  isActive: boolean;
  totems: Totem[];
  createdAt: Date;
}

export class Store {
  id: string;

  // TODO: create CNPJ value object
  cnpj: string;
  name: string;
  fantasyName: string;

  // TODO: create email value object
  email: string;

  // TODO: create phone value object
  phone: string;

  // TODO: create password value object
  salt: string;
  passwordHash: string;
  isActive: boolean;
  totems: Totem[] = [];
  createdAt: Date;

  private constructor(props: StoreProps) {
    this.id = props.id;
    this.name = props.name;
    this.cnpj = props.cnpj;
    this.email = props.email;
    this.fantasyName = props.fantasyName;
    this.phone = props.phone;
    this.isActive = props.isActive;
    this.isActive = props.isActive;
    this.fantasyName = props.fantasyName;
    this.salt = props.salt;
    this.passwordHash = props.passwordHash;
    this.totems = props.totems;
    this.createdAt = props.createdAt;

    this.validate();
  }

  inactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  addTotem(totem: Totem) {
    if (this.totems.find((t) => t.id === totem.id)) {
      throw new Error('Totem already exists');
    }
    this.totems.push(totem);
  }

  removeTotem(totemId: string) {
    const totemIndex = this.totems.findIndex((t) => t.id === totemId);
    if (totemIndex === -1) {
      throw new Error('Totem not found');
    }
    this.totems.splice(totemIndex, 1);
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
    if (!this.email) {
      throw new Error('Email is required');
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
    if (!this.cnpj) {
      throw new Error('CNPJ is required');
    }
    if (!this.fantasyName) {
      throw new Error('Fantasy name is required');
    }
    if (!this.phone) {
      throw new Error('Phone is required');
    }
    if (this.isActive !== !!this.isActive) {
      throw new Error('Is active must be a boolean');
    }
    if (!this.totems) {
      throw new Error('Totems is required');
    }
  }

  static create(props: {
    name: string;
    fantasyName: string;
    email: string;
    cnpj: string;
    plainPassword: string;
    phone: string;
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
      isActive: true,
      email: props.email,
      cnpj: props.cnpj,
      salt,
      totems: [],
      passwordHash,
      createdAt: new Date(),
    });
  }

  static restore(props: StoreProps): Store {
    return new Store(props);
  }
}
