import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import {
  Notification,
  NotificationDestinationToken,
} from '../entities/notification.entity';
import { NotificationDTO } from '../DTOs/notification.dto';
import { NotificationChannel } from '../entities/notification.enums';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';

export class NotificationMapper {
  static toDTO(notification: Notification): NotificationDTO {
    return {
      id: notification.id,
      channel: notification.channel,
      destinationToken: notification.destinationToken.toString(),
      message: notification.message,
      status: notification.status,
      errorMessage: notification.errorMessage,
      sentAt: notification.sentAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  static toEntity(dto: NotificationDTO): CoreResponse<Notification> {
    let destinationToken: NotificationDestinationToken;

    if (dto.channel === NotificationChannel.EMAIL) {
      const { error: emailError, value: email } = Email.create(
        dto.destinationToken,
      );
      if (emailError) {
        return { error: emailError, value: undefined };
      }
      destinationToken = email;
    } else if (
      dto.channel === NotificationChannel.WHATSAPP ||
      dto.channel === NotificationChannel.SMS
    ) {
      const { error: phoneError, value: phone } = BrazilianPhone.create(
        dto.destinationToken,
      );
      if (phoneError) {
        return { error: phoneError, value: undefined };
      }
      destinationToken = phone;
    } else {
      destinationToken = dto.destinationToken;
    }

    const notificationProps = {
      id: dto.id,
      channel: dto.channel,
      destinationToken,
      message: dto.message,
      status: dto.status,
      errorMessage: dto.errorMessage,
      sentAt: dto.sentAt,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };

    return Notification.restore(notificationProps);
  }
}
