import { SendNotificationResponse } from '../../models/dto/send-notification.dto';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';

export class NotificationChannelSMS implements NotificationChannelPort {
  sendNotification(
    destinationToken: string,
  ): Promise<SendNotificationResponse> {
    // Simulate sending a SMS notification
    console.log(`Sending SMS message to ${destinationToken}`);
    return Promise.resolve({ success: true });
  }
}
