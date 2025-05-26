import {
  NotificationChannel,
  NotificationDestinationToken,
} from '../domain/notification.model';

export interface SendNotificationDto {
  channel: NotificationChannel;
  destination_token: NotificationDestinationToken;
  message: string;
}

export type SendNotificationResponse =
  | { success: true }
  | { success: false; error_message: string };
