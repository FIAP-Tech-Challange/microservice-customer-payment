import { Entity, Column, PrimaryColumn } from 'typeorm';
import {
  NotificationChannel,
  NotificationStatus,
} from '../domain/notification.model';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column()
  destination_token: string;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: NotificationStatus })
  status: NotificationStatus;

  @Column()
  error_message: string;

  @Column({ nullable: true })
  sent_at: Date | null;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  updated_at: Date | null;
}
