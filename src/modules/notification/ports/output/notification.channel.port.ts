import { NotificationModel } from '../../models/domain/notification.model';
import { SendNotificationResponse } from '../../models/dto/send-notification.dto';

export const NOTIFICATION_CHANNEL_PORT_KEY = 'NotificationChannelPort';

export interface NotificationChannelPort {
  sendNotification(
    notification: NotificationModel,
  ): Promise<SendNotificationResponse>;
}
