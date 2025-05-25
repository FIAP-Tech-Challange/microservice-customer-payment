import { SendNotificationResponse } from '../../models/dto/send-notification.dto';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';

export class NotificationChannelWhatsApp implements NotificationChannelPort {
  sendNotification(
    destinationToken: string,
  ): Promise<SendNotificationResponse> {
    // Simulate sending a WhatsApp notification
    console.log(`Sending WhatsApp message to ${destinationToken}`);
    return Promise.resolve({ success: true });
  }
}
