import { Entity, Column, PrimaryColumn } from 'typeorm';
import {
  NotificationChannel,
  NotificationStatus,
} from '../domain/notification.model';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column()
  destination_token: string;

  @Column()
  message: string;

  @Column({ type: 'simple-enum', enum: NotificationStatus })
  status: NotificationStatus;

  @Column({ nullable: true })
  error_message?: string;

  @Column({ nullable: true })
  sent_at?: Date;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
