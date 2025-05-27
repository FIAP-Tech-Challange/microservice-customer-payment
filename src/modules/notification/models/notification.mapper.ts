import { Email } from 'src/shared/domain/email.vo';
import {
  NotificationChannel,
  NotificationDestinationToken,
  NotificationModel,
} from './domain/notification.model';
import { NotificationEntity } from './entities/notification.entity';
import { BrazilianPhone } from 'src/shared/domain/brazilian-phone.vo';

export class NotificationMapper {
  static toDomain(notification: NotificationEntity): NotificationModel {
    const buildDestinationToken = (
      channel: NotificationChannel,
      destinationToken: string,
    ): NotificationDestinationToken => {
      if (channel === NotificationChannel.EMAIL) {
        return new Email(destinationToken);
      } else if (channel === NotificationChannel.WHATSAPP) {
        return new BrazilianPhone(destinationToken);
      }
      return destinationToken;
    };

    return NotificationModel.restore({
      id: notification.id,
      channel: notification.channel,
      createdAt: notification.created_at,
      destinationToken: buildDestinationToken(
        notification.channel,
        notification.destination_token,
      ),
      errorMessage: notification.error_message,
      message: notification.message,
      sentAt: notification.sent_at,
      status: notification.status,
      updatedAt: notification.updated_at,
    });
  }

  static toEntity(notification: NotificationModel): NotificationEntity {
    const notificationEntity = new NotificationEntity();
    notificationEntity.id = notification.id;
    notificationEntity.channel = notification.channel;
    notificationEntity.created_at = notification.createdAt;
    notificationEntity.destination_token =
      notification.destinationToken instanceof Email ||
      notification.destinationToken instanceof BrazilianPhone
        ? notification.destinationToken.toString()
        : notification.destinationToken;
    notificationEntity.error_message = notification.errorMessage;
    notificationEntity.message = notification.message;
    notificationEntity.sent_at = notification.sentAt;
    notificationEntity.status = notification.status;
    notificationEntity.updated_at = notification.updatedAt;
    return notificationEntity;
  }
}
