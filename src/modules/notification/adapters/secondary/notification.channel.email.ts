import { SendNotificationResponse } from '../../models/dto/send-notification.dto';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';

export class NotificationChannelEmail implements NotificationChannelPort {
  sendNotification(
    destinationToken: string,
  ): Promise<SendNotificationResponse> {
    // Simulate sending an email notification
    console.log(`Sending email to ${destinationToken}`);
    return Promise.resolve({ success: true });
  }
}
