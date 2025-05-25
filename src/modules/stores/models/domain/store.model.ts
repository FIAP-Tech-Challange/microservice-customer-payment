import { randomUUID, pbkdf2Sync } from 'node:crypto';
import { TotemModel } from './totem.model';
import { ConflictException } from '@nestjs/common';
import { CNPJ } from './cnpj.vo';
import { Email } from 'src/shared/domain/email.vo';

interface StoreProps {
  id: string;
  name: string;
  fantasyName: string;
  email: Email;
  phone: string;
  salt: string;
  passwordHash: string;
  cnpj: CNPJ;
  isActive: boolean;
  totems: TotemModel[];
  createdAt: Date;
}

export class StoreModel {
  id: string;
  cnpj: CNPJ;
  name: string;
  fantasyName: string;
  email: Email;

  // TODO: create phone value object
  phone: string;

  // TODO: create password value object
  salt: string;
  passwordHash: string;
  isActive: boolean;
  totems: TotemModel[] = [];
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

  addTotem(totem: TotemModel) {
    this.totems.forEach((t) => {
      if (t.name === totem.name) {
        throw new ConflictException('Totem with this name already exists');
      }

      if (t.tokenAccess === totem.tokenAccess) {
        throw new ConflictException(
          'Totem with this token access already exists',
        );
      }

      if (t.id === totem.id) {
        throw new ConflictException('Totem with this id already exists');
      }
    });
    this.totems.push(totem);
  }

  inactivateTotem(totemId: string) {
    const totem = this.totems.find((t) => t.id === totemId);

    if (!totem) {
      throw new ConflictException('Totem not found');
    }

    totem.inactivate();
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
    email: Email;
    cnpj: CNPJ;
    plainPassword: string;
    phone: string;
  }): StoreModel {
    const id = randomUUID();
    const salt = randomUUID();
    const passwordHash = pbkdf2Sync(
      props.plainPassword,
      salt,
      100_000,
      64,
      'sha512',
    ).toString('hex');

    return new StoreModel({
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

  static restore(props: StoreProps): StoreModel {
    return new StoreModel(props);
  }
}
