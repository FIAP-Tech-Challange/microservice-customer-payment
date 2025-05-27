import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';
import { SendNotificationResponse } from '../../models/dto/send-notification.dto';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';

export class NotificationChannelWhatsApp implements NotificationChannelPort {
  sendNotification(
    destinationToken: BrazilianPhone,
    message: string,
  ): Promise<SendNotificationResponse> {
    // Simulate sending a WhatsApp notification
    console.log(
      `Sending WhatsApp message to ${destinationToken.toString()}. Message: ${message}`,
    );
    return Promise.resolve({ success: true });
  }
}
