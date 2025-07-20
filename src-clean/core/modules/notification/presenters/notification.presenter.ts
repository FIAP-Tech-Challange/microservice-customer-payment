import { PaginatedResponse } from 'src-clean/core/common/DTOs/paginatedResponse.dto';
import { Notification } from '../entities/notification.entity';
import { NotificationDTO } from '../DTOs/notification.dto';
import { Email } from 'src-clean/core/common/valueObjects/email.vo';
import { BrazilianPhone } from 'src-clean/core/common/valueObjects/brazilian-phone.vo';

export class NotificationPresenter {
  static toDTO(notification: Notification): NotificationDTO {
    const destinationToken = notification.destinationToken;
    let destinationTokenString: string;

    if (
      destinationToken instanceof Email ||
      destinationToken instanceof BrazilianPhone
    ) {
      destinationTokenString = destinationToken.toString();
    } else {
      destinationTokenString = destinationToken;
    }

    return {
      id: notification.id,
      channel: notification.channel,
      destinationToken: destinationTokenString,
      message: notification.message,
      status: notification.status,
      errorMessage: notification.errorMessage,
      sentAt: notification.sentAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  static toPaginatedDTO(
    notificationPaginated: PaginatedResponse<Notification>,
  ): PaginatedResponse<NotificationDTO> {
    return {
      page: notificationPaginated.page,
      limit: notificationPaginated.limit,
      total: notificationPaginated.total,
      totalPages: notificationPaginated.totalPages,
      data: notificationPaginated.data.map((notification) =>
        NotificationPresenter.toDTO(notification),
      ),
    };
  }
}
