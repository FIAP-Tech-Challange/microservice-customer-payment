import { CoreResponse } from 'src/common/DTOs/coreResponse';
import {
  Notification,
  NotificationDestinationToken,
} from '../entities/notification.entity';
import {
  NotificationChannel,
  NotificationStatus,
} from '../entities/notification.enums';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { NotificationDataSourceDTO } from 'src/common/dataSource/DTOs/notificationDataSource.dto';

export class NotificationMapper {
  static toPersistenceDTO(
    notification: Notification,
  ): NotificationDataSourceDTO {
    return {
      id: notification.id,
      channel: notification.channel,
      destination_token: notification.destinationToken.toString(),
      message: notification.message,
      status: notification.status,
      error_message: notification.errorMessage,
      sent_at: notification.sentAt
        ? notification.sentAt.toISOString()
        : undefined,
      created_at: notification.createdAt.toISOString(),
      updated_at: notification.updatedAt.toISOString(),
    };
  }

  static toEntity(dto: NotificationDataSourceDTO): CoreResponse<Notification> {
    let destinationToken: NotificationDestinationToken;

    if ((dto.channel as NotificationChannel) === NotificationChannel.EMAIL) {
      const createEmail = Email.create(dto.destination_token);
      if (createEmail.error) {
        return { error: createEmail.error, value: undefined };
      }
      destinationToken = createEmail.value;
    } else if (
      (dto.channel as NotificationChannel) === NotificationChannel.WHATSAPP ||
      (dto.channel as NotificationChannel) === NotificationChannel.SMS
    ) {
      const createPhone = BrazilianPhone.create(dto.destination_token);
      if (createPhone.error) {
        return { error: createPhone.error, value: undefined };
      }
      destinationToken = createPhone.value;
    } else {
      destinationToken = dto.destination_token;
    }

    const notificationProps = {
      id: dto.id,
      channel: dto.channel as NotificationChannel,
      destinationToken,
      message: dto.message,
      status: dto.status as NotificationStatus,
      errorMessage: dto.error_message,
      sentAt: dto.sent_at ? new Date(dto.sent_at) : undefined,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };

    return Notification.restore(notificationProps);
  }
}
