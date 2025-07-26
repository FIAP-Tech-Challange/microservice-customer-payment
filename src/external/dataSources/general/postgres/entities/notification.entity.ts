import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  channel: string;

  @Column()
  destination_token: string;

  @Column()
  message: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  error_message?: string;

  @Column({ nullable: true })
  sent_at?: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
