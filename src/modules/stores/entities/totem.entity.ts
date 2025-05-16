import { randomUUID } from 'node:crypto';

export class Totem {
  id: string;
  name: string;
  tokenAccess: string;
  isActive: boolean;

  private constructor(props: {
    id: string;
    name: string;
    tokenAccess: string;
    isActive: boolean;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.tokenAccess = props.tokenAccess;
    this.isActive = props.isActive;

    this.validate();
  }

  private validate() {
    if (!this.id) throw new Error('Id is required');
    if (!this.name) throw new Error('Name is required');
    if (!this.tokenAccess) throw new Error('Token access is required');
    if (!this.isActive) throw new Error('Is active is required');
  }

  activate() {
    this.isActive = true;
  }

  inactivate() {
    this.isActive = false;
  }

  static create(props: { name: string }): Totem {
    return new Totem({
      id: randomUUID(),
      name: props.name,
      tokenAccess: randomUUID(),
      isActive: true,
    });
  }

  static restore(props: {
    id: string;
    name: string;
    tokenAccess: string;
    isActive: boolean;
  }): Totem {
    return new Totem({
      id: props.id,
      name: props.name,
      tokenAccess: props.tokenAccess,
      isActive: props.isActive,
    });
  }
}
