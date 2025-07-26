import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { CoreException } from 'src/common/exceptions/coreException';
import { ResourceInvalidException } from 'src/common/exceptions/resourceInvalidException';
import { ResourceConflictException } from 'src/common/exceptions/resourceConflictException';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { CNPJ } from 'src/core/common/valueObjects/cnpj.vo';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { Totem } from './totem.entity';
import { generateUUID } from 'src/core/common/utils/uuid.helper';
import { encodeString } from 'src/core/common/utils/encoder.helper';

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
  totems: Totem[];
}

export class Store {
  private _id: string;
  private _cnpj: CNPJ;
  private _name: string;
  private _fantasyName: string;
  private _email: Email;
  private _phone: BrazilianPhone;

  private _salt: string;
  private _passwordHash: string;
  private _createdAt: Date;
  private _totems: Totem[];

  private constructor(props: StoreProps) {
    this._id = props.id;
    this._name = props.name;
    this._cnpj = props.cnpj;
    this._email = props.email;
    this._fantasyName = props.fantasyName;
    this._phone = props.phone;
    this._fantasyName = props.fantasyName;
    this._salt = props.salt;
    this._passwordHash = props.passwordHash;
    this._createdAt = props.createdAt;
    this._totems = props.totems;

    this.validate();
  }

  get id() {
    return this._id;
  }

  get cnpj() {
    return this._cnpj;
  }

  get name() {
    return this._name;
  }

  get fantasyName() {
    return this._fantasyName;
  }

  get email() {
    return this._email;
  }

  get phone() {
    return this._phone;
  }

  get salt() {
    return this._salt;
  }

  get passwordHash() {
    return this._passwordHash;
  }

  get createdAt() {
    return this._createdAt;
  }

  get totems() {
    return this._totems;
  }

  verifyPassword(plainPassword: string): boolean {
    const hash = encodeString(plainPassword, this.salt);

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
    if (!this.totems) {
      throw new ResourceInvalidException('Totems is required');
    } else {
      if (this.totems.some((totem) => !(totem instanceof Totem))) {
        throw new ResourceInvalidException('All totems must be valid');
      }
    }
  }

  removeTotem(totemId: string): CoreResponse<void> {
    try {
      const totemIndex = this.totems.findIndex((t) => t.id === totemId);
      if (totemIndex === -1) {
        throw new ResourceInvalidException('Totem not found');
      }
      this.totems.splice(totemIndex, 1);
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
    }
  }

  addTotem(totem: Totem): CoreResponse<undefined> {
    try {
      this.totems.forEach((t) => {
        if (t.name === totem.name) {
          throw new ResourceConflictException(
            'Totem with this name already exists',
          );
        }

        if (t.tokenAccess === totem.tokenAccess) {
          throw new ResourceConflictException(
            'Totem with this token access already exists',
          );
        }

        if (t.id === totem.id) {
          throw new ResourceConflictException(
            'Totem with this id already exists',
          );
        }
      });
      this.totems.push(totem);
      return { error: undefined, value: undefined };
    } catch (error) {
      return { error: error as CoreException, value: undefined };
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
    const id = generateUUID();
    const salt = generateUUID();
    const passwordHash = encodeString(props.plainPassword, salt);

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
        totems: [],
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
