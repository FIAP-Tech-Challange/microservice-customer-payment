import { SendNotificationResponse } from '../../models/dto/send-notification.dto';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';

export class NotificationChannelMonitor implements NotificationChannelPort {
  sendNotification(
    destinationToken: string,
  ): Promise<SendNotificationResponse> {
    // Simulate sending a monitor notification
    console.log(`Sending monitor notification to ${destinationToken}`);
    return Promise.resolve({ success: true });
  }
}
