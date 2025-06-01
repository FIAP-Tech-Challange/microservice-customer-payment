import { NotificationDestinationToken } from '../../models/domain/notification.model';
import { SendNotificationResponse } from '../../models/dto/send-notification.dto';

export const NOTIFICATION_CHANNEL_PORT_KEY = 'NotificationChannelPort';

export interface NotificationChannelPort {
  sendNotification(
    destinationToken: NotificationDestinationToken,
    message: string,
  ): Promise<SendNotificationResponse>;
}
