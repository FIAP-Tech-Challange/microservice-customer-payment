import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import {
  Notification,
  NotificationDestinationToken,
} from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';
import { CreateNotificationInputDTO } from '../DTOs/notificationInput.dto';
import { NotificationChannel } from '../entities/notification.enums';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';

export class CreateNotificationUseCase {
  constructor(private notificationGateway: NotificationGateway) {}

  async execute(
    dto: CreateNotificationInputDTO,
  ): Promise<CoreResponse<Notification>> {
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

    const { error: createError, value: notification } = Notification.create({
      channel: dto.channel,
      destinationToken,
      message: dto.message,
    });

    if (createError) {
      return { error: createError, value: undefined };
    }

    const { error: saveError, value: savedNotification } =
      await this.notificationGateway.saveNotification(notification);

    if (saveError) {
      return { error: saveError, value: undefined };
    }

    return { error: undefined, value: savedNotification };
  }
}
