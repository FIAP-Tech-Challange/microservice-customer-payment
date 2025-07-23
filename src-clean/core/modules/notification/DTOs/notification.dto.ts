import {
  NotificationStatus,
  NotificationChannel,
} from '../entities/notification.enums';

export interface NotificationDTO {
  id: string;
  channel: NotificationChannel;
  destinationToken: string;
  message: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
