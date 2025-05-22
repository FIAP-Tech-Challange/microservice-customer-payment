import { randomUUID } from 'node:crypto';

export class TotemModel {
  id: string;
  name: string;
  tokenAccess: string;
  isActive: boolean;
  createdAt: Date;

  private constructor(props: {
    id: string;
    name: string;
    tokenAccess: string;
    isActive: boolean;
    createdAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.tokenAccess = props.tokenAccess;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;

    this.validate();
  }

  private validate() {
    if (!this.id) throw new Error('Id is required');
    if (!this.name) throw new Error('Name is required');
    if (!this.tokenAccess) throw new Error('Token access is required');
    if (this.isActive !== !!this.isActive)
      throw new Error('Is active is required');
    if (!this.createdAt) throw new Error('Created at is required');
  }

  activate() {
    this.isActive = true;
  }

  inactivate() {
    this.isActive = false;
  }

  static create(props: { name: string }): TotemModel {
    return new TotemModel({
      id: randomUUID(),
      name: props.name,
      tokenAccess: randomUUID(),
      isActive: true,
      createdAt: new Date(),
    });
  }

  static restore(props: {
    id: string;
    name: string;
    tokenAccess: string;
    isActive: boolean;
    createdAt: Date;
  }): TotemModel {
    return new TotemModel({
      id: props.id,
      name: props.name,
      tokenAccess: props.tokenAccess,
      isActive: props.isActive,
      createdAt: props.createdAt,
    });
  }
}
