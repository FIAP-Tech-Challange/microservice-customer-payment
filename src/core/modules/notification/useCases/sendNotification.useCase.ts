import { CoreResponse } from 'src/common/DTOs/coreResponse';
import {
  Notification,
  NotificationDestinationToken,
} from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';
import { SendNotificationInputDTO } from '../DTOs/notificationInput.dto';
import {
  NotificationChannel,
  NotificationStatus,
} from '../entities/notification.enums';
import { Email } from 'src/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src/core/common/valueObjects/brazilian-phone.vo';
import { UnexpectedError } from 'src/common/exceptions/unexpectedError';

export class SendNotificationUseCase {
  constructor(private notificationGateway: NotificationGateway) {}

  async execute(
    dto: SendNotificationInputDTO,
  ): Promise<CoreResponse<Notification>> {
    let destinationToken: NotificationDestinationToken;

    if (dto.channel === NotificationChannel.EMAIL) {
      const createEmail = Email.create(dto.destinationToken);
      if (createEmail.error) {
        return { error: createEmail.error, value: undefined };
      }
      destinationToken = createEmail.value;
    } else if (
      dto.channel === NotificationChannel.WHATSAPP ||
      dto.channel === NotificationChannel.SMS
    ) {
      const createPhone = BrazilianPhone.create(dto.destinationToken);
      if (createPhone.error) {
        return { error: createPhone.error, value: undefined };
      }
      destinationToken = createPhone.value;
    } else {
      destinationToken = dto.destinationToken;
    }

    const createNotification = Notification.create({
      channel: dto.channel,
      destinationToken,
      message: dto.message,
    });

    if (createNotification.error) {
      return { error: createNotification.error, value: undefined };
    }

    const sendNotification = await this.notificationGateway.sendNotification(
      createNotification.value,
    );

    if (sendNotification.error) {
      return { error: sendNotification.error, value: undefined };
    }

    const sentNotification = sendNotification.value;

    if (sentNotification.status === NotificationStatus.FAILED) {
      return {
        error: new UnexpectedError('Failed to send notification'),
        value: undefined,
      };
    }

    if (sentNotification.status === NotificationStatus.PENDING) {
      return {
        error: new UnexpectedError('Notification is pending'),
        value: undefined,
      };
    }

    return { error: undefined, value: sentNotification };
  }
}
