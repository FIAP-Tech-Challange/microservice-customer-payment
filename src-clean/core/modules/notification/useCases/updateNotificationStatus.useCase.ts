import { CoreResponse } from 'src-clean/common/DTOs/coreResponse';
import { ResourceNotFoundException } from 'src-clean/common/exceptions/resourceNotFoundException';
import { ResourceInvalidException } from 'src-clean/common/exceptions/resourceInvalidException';
import { Notification } from '../entities/notification.entity';
import { NotificationGateway } from '../gateways/notification.gateway';
import { UpdateNotificationStatusInputDTO } from '../DTOs/notificationInput.dto';

export class UpdateNotificationStatusUseCase {
  constructor(private notificationGateway: NotificationGateway) {}

  async execute(
    dto: UpdateNotificationStatusInputDTO,
  ): Promise<CoreResponse<Notification>> {
    const { error: findError, value: notification } =
      await this.notificationGateway.findNotificationById(dto.id);

    if (findError) {
      return { error: findError, value: undefined };
    }

    if (!notification) {
      return {
        error: new ResourceNotFoundException(
          `Notification with ID ${dto.id} not found`,
        ),
        value: undefined,
      };
    }

    let updatedNotification: Notification;

    if (dto.status === 'SENT') {
      const { error: updateError, value: updated } = notification.markAsSent();
      if (updateError) {
        return { error: updateError, value: undefined };
      }
      updatedNotification = updated;
    } else if (dto.status === 'FAILED') {
      if (!dto.errorMessage) {
        return {
          error: new ResourceInvalidException(
            'Error message is required when marking as failed',
          ),
          value: undefined,
        };
      }
      const { error: updateError, value: updated } = notification.markAsFailed(
        dto.errorMessage,
      );
      if (updateError) {
        return { error: updateError, value: undefined };
      }
      updatedNotification = updated;
    } else {
      return {
        error: new ResourceInvalidException(
          'Invalid status. Must be SENT or FAILED',
        ),
        value: undefined,
      };
    }

    const { error: saveError, value: savedNotification } =
      await this.notificationGateway.updateNotification(updatedNotification);

    if (saveError) {
      return { error: saveError, value: undefined };
    }

    return { error: undefined, value: savedNotification };
  }
}
