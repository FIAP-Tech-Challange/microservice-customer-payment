import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { StoreEntity } from './store.entity';

@Entity('totems')
export class TotemEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  token_access: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => StoreEntity, (store) => store.totems, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'store_id' })
  store: StoreEntity;

  @Column()
  store_id: string;
}
