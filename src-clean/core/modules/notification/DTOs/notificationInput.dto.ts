import { NotificationChannel } from '../entities/notification.enums';

export interface CreateNotificationInputDTO {
  channel: NotificationChannel;
  destinationToken: string;
  message: string;
}

export interface FindNotificationByIdInputDTO {
  id: string;
}

export interface UpdateNotificationStatusInputDTO {
  id: string;
  status: 'SENT' | 'FAILED';
  errorMessage?: string;
}

export interface FindNotificationsByStatusInputDTO {
  status?: string;
  page?: number;
  size?: number;
}

export interface FindAllNotificationsInputDTO {
  page?: number;
  size?: number;
}
