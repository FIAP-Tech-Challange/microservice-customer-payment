import { Inject } from '@nestjs/common';
import {
  SendNotificationDto,
  SendNotificationResponse,
} from './models/dto/send-notification.dto';
import {
  NOTIFICATION_REPOSITORY_PORT_KEY,
  NotificationRepositoryPort,
} from './ports/output/notification.repository.port';
import {
  NOTIFICATION_CHANNEL_PORT_KEY,
  NotificationChannelPort,
} from './ports/output/notification.channel.port';
import { NotificationModel } from './models/domain/notification.model';

export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PORT_KEY)
    private readonly notificationRepository: NotificationRepositoryPort,
    @Inject(NOTIFICATION_CHANNEL_PORT_KEY)
    private readonly notificationChannel: NotificationChannelPort,
  ) {}

  // This method is sync, maybe change later to be async
  async sendNotification(
    dto: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    const notification = NotificationModel.create(
      dto.channel,
      dto.destination_token,
      dto.message,
    );

    await this.notificationRepository.create(notification);

    const sendResult =
      await this.notificationChannel.sendNotification(notification);

    if (!sendResult.success) {
      notification.setError(sendResult.error_message);
    } else {
      notification.setSent();
    }

    await this.notificationRepository.update(notification);
    return sendResult;
  }
}
