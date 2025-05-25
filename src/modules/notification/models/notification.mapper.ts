import { NotificationModel } from './domain/notification.model';
import { NotificationEntity } from './entities/notification.entity';

export class NotificationMapper {
  static toDomain(notification: NotificationEntity): NotificationModel {
    return NotificationModel.restore({
      id: notification.id,
      channel: notification.channel,
      createdAt: notification.created_at,
      destinationToken: notification.destination_token,
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
    notificationEntity.destination_token = notification.destinationToken;
    notificationEntity.error_message = notification.errorMessage;
    notificationEntity.message = notification.message;
    notificationEntity.sent_at = notification.sentAt;
    notificationEntity.status = notification.status;
    notificationEntity.updated_at = notification.updatedAt;
    return notificationEntity;
  }
}
