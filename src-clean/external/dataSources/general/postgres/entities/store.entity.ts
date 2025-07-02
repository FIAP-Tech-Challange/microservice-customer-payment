import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { TotemEntity } from './totem.entity';

@Entity('stores')
export class StoreEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  cnpj: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  fantasy_name: string;

  @Column()
  phone: string;

  @Column()
  salt: string;

  @Column()
  password_hash: string;

  @Column()
  created_at: Date;

  @OneToMany(() => TotemEntity, (totem) => totem.store, {
    cascade: true,
    eager: true,
  })
  totems: TotemEntity[];
}
