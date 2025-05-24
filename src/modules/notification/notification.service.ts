import { Inject, Injectable } from '@nestjs/common';
import {
  SendNotificationDto,
  SendNotificationResponse,
} from './models/dto/send-notification.dto';
import {
  NOTIFICATION_REPOSITORY_PORT_KEY,
  NotificationRepositoryPort,
} from './ports/output/notification.repository.port';
import { NotificationModel } from './models/domain/notification.model';
import { NotificationChannelFactory } from './adapters/secondary/notification.channel.factory';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PORT_KEY)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  // This method is sync, maybe change it to event based
  async sendNotification(
    dto: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    const notification = NotificationModel.create(
      dto.channel,
      dto.destination_token,
      dto.message,
    );

    await this.notificationRepository.create(notification);

    const notificationChannel = NotificationChannelFactory.create(notification);

    const sendResult = await notificationChannel.sendNotification(
      notification.destinationToken,
    );

    if (!sendResult.success) {
      notification.setError(sendResult.error_message);
    } else {
      notification.setSent();
    }

    await this.notificationRepository.update(notification);

    return sendResult;
  }
}
