import { Email } from 'src/shared/domain/email.vo';
import { SendNotificationResponse } from '../../models/dto/send-notification.dto';
import { NotificationChannelPort } from '../../ports/output/notification.channel.port';

export class NotificationChannelEmail implements NotificationChannelPort {
  sendNotification(
    destinationToken: Email,
    message: string,
  ): Promise<SendNotificationResponse> {
    // Simulate sending an email notification
    console.log(
      `Sending email to ${destinationToken.toString()}. Message: ${message}`,
    );
    return Promise.resolve({ success: true });
  }
}
