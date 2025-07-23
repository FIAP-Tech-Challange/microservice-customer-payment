import { NotificationChannel } from '../entities/notification.enums';

export interface SendNotificationInputDTO {
  channel: NotificationChannel;
  destinationToken: string;
  message: string;
}
