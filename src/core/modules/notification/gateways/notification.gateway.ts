import { DataSource } from 'src/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src/common/DTOs/coreResponse';
import { Notification } from '../entities/notification.entity';
import { NotificationChannel } from '../entities/notification.enums';
import { NotificationMapper } from '../mappers/notification.mapper';

export class NotificationGateway {
  constructor(private dataSource: DataSource) {}

  async sendNotification(
    notification: Notification,
  ): Promise<CoreResponse<Notification>> {
    let error: string | undefined;

    if (notification.channel === NotificationChannel.EMAIL) {
      ({ error } = await this.dataSource.sendEmailNotification(
        notification.destinationToken.toString(),
        notification.message,
      ));
    } else if (notification.channel === NotificationChannel.WHATSAPP) {
      ({ error } = await this.dataSource.sendWhatsappNotification(
        notification.destinationToken.toString(),
        notification.message,
      ));
    } else if (notification.channel === NotificationChannel.SMS) {
      ({ error } = await this.dataSource.sendSMSNotification(
        notification.destinationToken.toString(),
        notification.message,
      ));
    } else if (notification.channel === NotificationChannel.MONITOR) {
      ({ error } = await this.dataSource.sendMonitorNotification(
        notification.destinationToken.toString(),
        notification.message,
      ));
    }

    if (error) {
      notification.markAsFailed(error);
    } else {
      notification.markAsSent();
    }

    const notificationDataSourceDTO =
      NotificationMapper.toPersistenceDTO(notification);

    await this.dataSource.saveNotification(notificationDataSourceDTO);

    return { error: undefined, value: notification };
  }
}
