import { DataSource } from 'src-clean/common/dataSource/dataSource.interface';
import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import {
  Notification,
  NotificationDestinationToken,
} from '../entities/notification.entity';
import { NotificationDataSourceDTO } from 'src-clean/common/dataSource/DTOs/notificationDataSource.dto';
import {
  NotificationChannel,
  NotificationStatus,
} from '../entities/notification.enums';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';
import {
  FindNotificationsByStatusInputDTO,
  FindAllNotificationsInputDTO,
} from '../DTOs/notificationInput.dto';

export class NotificationGateway {
  constructor(private dataSource: DataSource) {}

  private fromDataSourceDTO(
    dataSourceDTO: NotificationDataSourceDTO,
  ): CoreResponse<Notification> {
    let destinationToken: NotificationDestinationToken;

    if (dataSourceDTO.channel === NotificationChannel.EMAIL) {
      const { error: emailError, value: email } = Email.create(
        dataSourceDTO.destination_token,
      );
      if (emailError) {
        return { error: emailError, value: undefined };
      }
      destinationToken = email;
    } else if (
      dataSourceDTO.channel === NotificationChannel.WHATSAPP ||
      dataSourceDTO.channel === NotificationChannel.SMS
    ) {
      const { error: phoneError, value: phone } = BrazilianPhone.create(
        dataSourceDTO.destination_token,
      );
      if (phoneError) {
        return { error: phoneError, value: undefined };
      }
      destinationToken = phone;
    } else {
      destinationToken = dataSourceDTO.destination_token;
    }

    const notificationProps = {
      id: dataSourceDTO.id,
      channel: dataSourceDTO.channel,
      destinationToken,
      message: dataSourceDTO.message,
      status: dataSourceDTO.status,
      errorMessage: dataSourceDTO.error_message,
      sentAt: dataSourceDTO.sent_at,
      createdAt: dataSourceDTO.created_at,
      updatedAt: dataSourceDTO.updated_at,
    };

    return Notification.restore(notificationProps);
  }

  private toDataSourceDTO(
    notification: Notification,
  ): NotificationDataSourceDTO {
    return {
      id: notification.id,
      channel: notification.channel,
      destination_token: notification.destinationToken.toString(),
      message: notification.message,
      status: notification.status,
      error_message: notification.errorMessage,
      sent_at: notification.sentAt,
      created_at: notification.createdAt,
      updated_at: notification.updatedAt,
    };
  }

  async findNotificationById(
    id: string,
  ): Promise<CoreResponse<Notification | null>> {
    const notificationDataSourceDTO =
      await this.dataSource.findNotificationById(id);
    if (!notificationDataSourceDTO) return { error: undefined, value: null };

    return this.fromDataSourceDTO(notificationDataSourceDTO);
  }

  async findNotificationsByStatus(
    params: FindNotificationsByStatusInputDTO,
  ): Promise<CoreResponse<Notification[]>> {
    const dataSourceParams = {
      status: params.status ? (params.status as NotificationStatus) : undefined,
      page: params.page,
      size: params.size,
    };

    const notificationsDataSourceDTO =
      await this.dataSource.findNotificationsByStatus(dataSourceParams);

    if (
      !notificationsDataSourceDTO ||
      notificationsDataSourceDTO.length === 0
    ) {
      return { error: undefined, value: [] };
    }

    const notifications: Notification[] = [];

    for (const notificationDataSourceDTO of notificationsDataSourceDTO) {
      const notificationEntityResult = this.fromDataSourceDTO(
        notificationDataSourceDTO,
      );

      if (notificationEntityResult.error) {
        return { error: notificationEntityResult.error, value: undefined };
      }

      notifications.push(notificationEntityResult.value);
    }

    return { error: undefined, value: notifications };
  }

  async findAllNotifications(
    params: FindAllNotificationsInputDTO,
  ): Promise<CoreResponse<Notification[]>> {
    const dataSourceParams = {
      page: params.page,
      size: params.size,
    };

    const notificationsDataSourceDTO =
      await this.dataSource.findAllNotifications(dataSourceParams);

    if (
      !notificationsDataSourceDTO ||
      notificationsDataSourceDTO.length === 0
    ) {
      return { error: undefined, value: [] };
    }

    const notifications: Notification[] = [];
    for (const notificationDataSourceDTO of notificationsDataSourceDTO) {
      const { error, value } = this.fromDataSourceDTO(
        notificationDataSourceDTO,
      );
      if (error) {
        return { error, value: undefined };
      }
      notifications.push(value);
    }

    return { error: undefined, value: notifications };
  }

  async saveNotification(
    notification: Notification,
  ): Promise<CoreResponse<Notification>> {
    const notificationDataSourceDTO = this.toDataSourceDTO(notification);
    await this.dataSource.saveNotification(notificationDataSourceDTO);

    return { error: undefined, value: notification };
  }

  async updateNotification(
    notification: Notification,
  ): Promise<CoreResponse<Notification>> {
    const notificationDataSourceDTO = this.toDataSourceDTO(notification);
    await this.dataSource.updateNotification(notificationDataSourceDTO);

    return { error: undefined, value: notification };
  }
}
