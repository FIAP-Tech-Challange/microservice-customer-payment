import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('totems')
export class TotemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  token_access: string;

  @Column()
  is_active: boolean;

  @Column()
  created_at: Date;

  @ManyToOne(() => StoreEntity, (store) => store.totems, {
    onDelete: 'CASCADE',
  })
  store: StoreEntity;

  @Column()
  store_id: string;
}
