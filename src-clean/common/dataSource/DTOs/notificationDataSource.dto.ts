import {
  NotificationStatus,
  NotificationChannel,
} from 'src-clean/core/modules/notification/entities/notification.enums';

export interface NotificationDataSourceDTO {
  id: string;
  channel: NotificationChannel;
  destination_token: string;
  message: string;
  status: NotificationStatus;
  error_message?: string;
  sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface FindNotificationsByStatusParamsDTO {
  status?: NotificationStatus;
  page?: number;
  size?: number;
}
