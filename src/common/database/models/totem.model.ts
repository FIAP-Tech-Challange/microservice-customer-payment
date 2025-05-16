import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreModel } from './store.model';

@Entity('totems')
export class TotemModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  token_access: string;

  @Column()
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => StoreModel, (store) => store.totems, { onDelete: 'CASCADE' })
  store: StoreModel;

  @Column()
  store_id: string;
}
